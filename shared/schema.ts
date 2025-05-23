import { pgTable, text, serial, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (will contain both job seekers and employers)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull().default("job_seeker"), // 'job_seeker' or 'employer' or 'admin'
  profileCompleted: boolean("profile_completed").default(false),
  status: text("status").notNull().default("active"), // 'active', 'blocked', or 'suspended'
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Must provide a valid email"),
  userType: z.enum(['job_seeker', 'employer', 'admin'], {
    errorMap: () => ({ message: "User type must be one of: job_seeker, employer, admin" })
  })
}).pick({
  username: true,
  password: true,
  email: true,
  userType: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Job Seeker Profiles table
export const jobSeekerProfiles = pgTable("job_seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  location: text("location"),
  bio: text("bio"),
  resumeUrl: text("resume_url"),
  skills: text("skills").array(),
  education: jsonb("education"), // Array of education details
  experience: jsonb("experience"), // Array of work experience details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertJobSeekerProfileSchema = createInsertSchema(jobSeekerProfiles, {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  resumeUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.any().optional(),
  experience: z.any().optional()
});

export type InsertJobSeekerProfile = z.infer<typeof insertJobSeekerProfileSchema>;
export type JobSeekerProfile = typeof jobSeekerProfiles.$inferSelect;

// Employer Profiles table
export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  companySize: text("company_size"),
  location: text("location"),
  website: text("website"),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertEmployerProfileSchema = createInsertSchema(employerProfiles, {
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  companySize: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional()
});

export type InsertEmployerProfile = z.infer<typeof insertEmployerProfileSchema>;
export type EmployerProfile = typeof employerProfiles.$inferSelect;

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  qualifications: text("qualifications").notNull(),
  responsibilities: text("responsibilities").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(), // 'full-time', 'part-time', 'contract', 'internship'
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  skills: text("skills").array(),
  isActive: boolean("is_active").default(true),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertJobSchema = createInsertSchema(jobs, {
  title: z.string().min(5, "Job title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  qualifications: z.string().min(10, "Qualifications must be at least 10 characters"),
  responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
    errorMap: () => ({ message: "Job type must be one of: full-time, part-time, contract, internship" })
  }),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  skills: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional()
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  jobSeekerId: integer("job_seeker_id").references(() => users.id).notNull(),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status").notNull().default("applied"), // 'applied', 'reviewed', 'interviewing', 'offered', 'rejected'
  compatibilityScore: decimal("compatibility_score", { precision: 5, scale: 2 }),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertApplicationSchema = createInsertSchema(applications, {
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  compatibilityScore: z.number().optional(),
  status: z.enum(['applied', 'reviewed', 'interviewing', 'offered', 'rejected'], {
    errorMap: () => ({ message: "Status must be one of: applied, reviewed, interviewing, offered, rejected" })
  })
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Wishlists table (for job seekers to save jobs)
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  jobSeekerId: integer("job_seeker_id").references(() => users.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

export const insertWishlistSchema = createInsertSchema(wishlists);

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

// Watchlists table (for employers to track promising candidates)
export const watchlists = pgTable("watchlists", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => users.id).notNull(),
  jobSeekerId: integer("job_seeker_id").references(() => users.id).notNull(),
  notes: text("notes"),
  addedAt: timestamp("added_at").defaultNow().notNull()
});

export const insertWatchlistSchema = createInsertSchema(watchlists, {
  notes: z.string().optional()
});

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlists.$inferSelect;

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow().notNull()
});

export const insertMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1, "Message cannot be empty")
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'bug', 'feature', 'complaint', 'other'
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'in_progress', 'resolved'
  adminResponse: text("admin_response"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertFeedbackSchema = createInsertSchema(feedback, {
  type: z.enum(['bug', 'feature', 'complaint', 'other'], {
    errorMap: () => ({ message: "Type must be one of: bug, feature, complaint, other" })
  }),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.string().optional(),
  adminResponse: z.string().optional()
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  jobSeekerProfile: one(jobSeekerProfiles, {
    fields: [users.id],
    references: [jobSeekerProfiles.userId]
  }),
  employerProfile: one(employerProfiles, {
    fields: [users.id],
    references: [employerProfiles.userId]
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  feedbackSubmissions: many(feedback),
  jobListings: many(jobs, { relationName: "employer" }),
  applications: many(applications, { relationName: "jobSeeker" }),
  wishlists: many(wishlists, { relationName: "jobSeeker" }),
  watchlists: many(watchlists, { relationName: "employer" })
}));

export const jobSeekerProfilesRelations = relations(jobSeekerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [jobSeekerProfiles.userId],
    references: [users.id]
  })
}));

export const employerProfilesRelations = relations(employerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [employerProfiles.userId],
    references: [users.id]
  })
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  employer: one(users, {
    fields: [jobs.employerId],
    references: [users.id]
  }),
  applications: many(applications),
  wishlists: many(wishlists)
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id]
  }),
  jobSeeker: one(users, {
    fields: [applications.jobSeekerId],
    references: [users.id]
  })
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  job: one(jobs, {
    fields: [wishlists.jobId],
    references: [jobs.id]
  }),
  jobSeeker: one(users, {
    fields: [wishlists.jobSeekerId],
    references: [users.id]
  })
}));

export const watchlistsRelations = relations(watchlists, ({ one }) => ({
  employer: one(users, {
    fields: [watchlists.employerId],
    references: [users.id]
  }),
  jobSeeker: one(users, {
    fields: [watchlists.jobSeekerId],
    references: [users.id]
  })
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender"
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver"
  })
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id]
  })
}));
