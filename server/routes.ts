import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { eq, like, desc, and, gte, lte, or } from "drizzle-orm";
import { db } from "@db";
import { jobs, applications, jobSeekerProfiles, employerProfiles, users } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // ---------- JOB LISTINGS API ROUTES ----------
  
  // Get all jobs with filtering options
  app.get("/api/jobs", async (req, res) => {
    try {
      const location = req.query.location as string | undefined;
      const jobType = req.query.jobType as string | undefined;
      const search = req.query.search as string | undefined;
      const minSalary = req.query.minSalary ? String(req.query.minSalary) : undefined;
      const maxSalary = req.query.maxSalary ? String(req.query.maxSalary) : undefined;
      const skill = req.query.skill as string | undefined;
      
      let query = db.select().from(jobs);
      
      // Filter by location
      if (location && location !== 'all') {
        query = query.where(like(jobs.location, `%${location}%`));
      }
      
      // Filter by job type
      if (jobType && jobType !== 'all') {
        query = query.where(eq(jobs.jobType, jobType));
      }
      
      // Filter by salary range
      if (minSalary !== undefined) {
        query = query.where(gte(jobs.salaryMin, minSalary));
      }
      
      if (maxSalary !== undefined) {
        query = query.where(lte(jobs.salaryMax, maxSalary));
      }
      
      // Search in title and description
      if (search) {
        query = query.where(
          or(
            like(jobs.title, `%${search}%`),
            like(jobs.description, `%${search}%`)
          )
        );
      }
      
      // Only return active jobs
      query = query.where(eq(jobs.isActive, true));
      
      // Order by most recent first
      query = query.orderBy(desc(jobs.postedAt));
      
      const allJobs = await query;
      res.json(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Get a single job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, id),
        with: {
          employer: {
            with: {
              employerProfile: true
            }
          }
        }
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Post a new job (Protected route for employers)
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure the user is an employer
    if (req.user?.userType !== 'employer') {
      return res.status(403).json({ error: "Only employers can post jobs" });
    }

    try {
      const jobData = {
        ...req.body,
        employerId: req.user.id
      };

      // Validate job data
      const validatedData = z.object({
        title: z.string().min(5, "Job title must be at least 5 characters"),
        description: z.string().min(20, "Description must be at least 20 characters"),
        qualifications: z.string().min(10, "Qualifications must be at least 10 characters"),
        responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
        location: z.string().min(2, "Location must be at least 2 characters"),
        jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
        salaryMin: z.string().optional(),
        salaryMax: z.string().optional(),
        skills: z.array(z.string()).optional(),
        employerId: z.number()
      }).parse(jobData);

      const [newJob] = await db.insert(jobs).values(validatedData).returning();
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error posting job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to post job" });
    }
  });

  // Update a job (Protected route for the employer who created the job)
  app.put("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      // Get the job to check ownership
      const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId)
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Check if the user is the employer who created this job
      if (job.employerId !== req.user?.id && req.user?.userType !== 'admin') {
        return res.status(403).json({ error: "You don't have permission to edit this job" });
      }

      // Validate the update data
      const validatedData = z.object({
        title: z.string().min(5, "Job title must be at least 5 characters").optional(),
        description: z.string().min(20, "Description must be at least 20 characters").optional(),
        qualifications: z.string().min(10, "Qualifications must be at least 10 characters").optional(),
        responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters").optional(),
        location: z.string().min(2, "Location must be at least 2 characters").optional(),
        jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
        salaryMin: z.string().optional(),
        salaryMax: z.string().optional(),
        skills: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
        expiresAt: z.date().optional()
      }).parse(req.body);

      // Add updatedAt field
      const updateData = {
        ...validatedData,
        updatedAt: new Date()
      };

      const [updatedJob] = await db.update(jobs)
        .set(updateData)
        .where(eq(jobs.id, jobId))
        .returning();

      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // ---------- JOB APPLICATIONS API ROUTES ----------

  // Apply for a job (Protected route for job seekers)
  app.post("/api/jobs/:id/apply", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure the user is a job seeker
    if (req.user?.userType !== 'job_seeker') {
      return res.status(403).json({ error: "Only job seekers can apply for jobs" });
    }

    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      // Check if the job exists
      const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId)
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Check if the job is still active
      if (!job.isActive) {
        return res.status(400).json({ error: "This job is no longer accepting applications" });
      }

      // Check if user has already applied for this job
      const existingApplication = await db.query.applications.findFirst({
        where: and(
          eq(applications.jobId, jobId),
          eq(applications.jobSeekerId, req.user.id)
        )
      });

      if (existingApplication) {
        return res.status(400).json({ error: "You have already applied for this job" });
      }

      // Validate application data
      const applicationData = {
        jobId,
        jobSeekerId: req.user.id,
        resumeUrl: req.body.resumeUrl,
        coverLetter: req.body.coverLetter
      };

      const validatedData = z.object({
        jobId: z.number(),
        jobSeekerId: z.number(),
        resumeUrl: z.string().url().optional(),
        coverLetter: z.string().optional()
      }).parse(applicationData);

      // Placeholder for AI-based matching score calculation
      // In a real implementation, this would use NLP to compare skills and job requirements
      const compatibilityScore = "75.5"; // Random score between 0-100 for demo

      const [newApplication] = await db.insert(applications)
        .values({
          ...validatedData,
          compatibilityScore
        })
        .returning();

      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to apply for job" });
    }
  });

  // Get all applications for a job (Protected route for employers)
  app.get("/api/jobs/:id/applications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      // Check if the job exists and belongs to the requesting employer
      const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId)
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Only the employer who posted the job or an admin can view its applications
      if (job.employerId !== req.user?.id && req.user?.userType !== 'admin') {
        return res.status(403).json({ error: "You don't have permission to view these applications" });
      }

      const jobApplications = await db.query.applications.findMany({
        where: eq(applications.jobId, jobId),
        with: {
          jobSeeker: {
            with: {
              jobSeekerProfile: true
            }
          }
        },
        orderBy: desc(applications.appliedAt)
      });

      res.json(jobApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Update application status (Protected route for employers)
  app.put("/api/applications/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ error: "Invalid application ID" });
      }

      // Get the application with job info to check ownership
      const application = await db.query.applications.findFirst({
        where: eq(applications.id, applicationId),
        with: {
          job: true
        }
      });

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Only the employer who created the job can update application status
      if (application.job.employerId !== req.user?.id && req.user?.userType !== 'admin') {
        return res.status(403).json({ error: "You don't have permission to update this application" });
      }

      // Validate the update data
      const validatedData = z.object({
        status: z.enum(['applied', 'reviewed', 'interviewing', 'offered', 'rejected'])
      }).parse(req.body);

      const [updatedApplication] = await db.update(applications)
        .set({
          ...validatedData,
          updatedAt: new Date()
        })
        .where(eq(applications.id, applicationId))
        .returning();

      res.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
