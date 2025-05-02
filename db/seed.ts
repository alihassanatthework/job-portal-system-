import { db } from "./index";
import { 
  users, 
  insertUserSchema, 
  jobs, 
  insertJobSchema, 
  jobSeekerProfiles, 
  employerProfiles,
  insertJobSeekerProfileSchema,
  insertEmployerProfileSchema
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Check for existing users to avoid duplicates
    const existingUsers = await db.query.users.findMany();
    
    if (existingUsers.length === 0) {
      console.log("Seeding users...");
      
      // Create admin user
      const adminUser = {
        username: "admin",
        password: await hashPassword("admin123"),
        email: "admin@jobportal.com",
        userType: "admin"
      };
      const validatedAdmin = insertUserSchema.parse(adminUser);
      const [newAdmin] = await db.insert(users).values(validatedAdmin).returning();
      console.log(`✅ Created admin user: ${newAdmin.username}`);
      
      // Create employer users
      const employerUsers = [
        {
          username: "techcorp",
          password: await hashPassword("password123"),
          email: "hr@techcorp.com",
          userType: "employer"
        },
        {
          username: "innovate_inc",
          password: await hashPassword("password123"),
          email: "careers@innovateinc.com",
          userType: "employer"
        },
        {
          username: "globalfirm",
          password: await hashPassword("password123"),
          email: "jobs@globalfirm.com",
          userType: "employer"
        }
      ];
      
      const employerIds = [];
      for (const employer of employerUsers) {
        const validated = insertUserSchema.parse(employer);
        const [newEmployer] = await db.insert(users).values(validated).returning();
        employerIds.push(newEmployer.id);
        console.log(`✅ Created employer user: ${newEmployer.username}`);
      }
      
      // Create job seeker users
      const jobSeekerUsers = [
        {
          username: "jobseeker1",
          password: await hashPassword("password123"),
          email: "seeker1@example.com",
          userType: "job_seeker"
        },
        {
          username: "devhunter",
          password: await hashPassword("password123"),
          email: "dev@example.com",
          userType: "job_seeker"
        },
        {
          username: "designer_pro",
          password: await hashPassword("password123"),
          email: "design@example.com",
          userType: "job_seeker"
        }
      ];
      
      const jobSeekerIds = [];
      for (const seeker of jobSeekerUsers) {
        const validated = insertUserSchema.parse(seeker);
        const [newSeeker] = await db.insert(users).values(validated).returning();
        jobSeekerIds.push(newSeeker.id);
        console.log(`✅ Created job seeker user: ${newSeeker.username}`);
      }
      
      // Create employer profiles
      console.log("Seeding employer profiles...");
      const employerProfilesData = [
        {
          userId: employerIds[0],
          companyName: "Tech Corp",
          industry: "Information Technology",
          companySize: "1000-5000",
          location: "San Francisco, CA",
          website: "https://techcorp.example.com",
          description: "A leading technology company specializing in innovative software solutions.",
          logoUrl: "https://images.unsplash.com/photo-1549921860-13ba08789bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          userId: employerIds[1],
          companyName: "Innovate Inc",
          industry: "Software Development",
          companySize: "100-500",
          location: "Austin, TX",
          website: "https://innovateinc.example.com",
          description: "Startup focused on cutting-edge AI applications and machine learning solutions.",
          logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          userId: employerIds[2],
          companyName: "Global Firm",
          industry: "Finance",
          companySize: "5000+",
          location: "New York, NY",
          website: "https://globalfirm.example.com",
          description: "Multinational financial services corporation with a strong tech division.",
          logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
      ];
      
      for (const profile of employerProfilesData) {
        const validated = insertEmployerProfileSchema.parse(profile);
        await db.insert(employerProfiles).values(validated);
      }
      console.log(`✅ Seeded ${employerProfilesData.length} employer profiles`);
      
      // Create job seeker profiles
      console.log("Seeding job seeker profiles...");
      const jobSeekerProfilesData = [
        {
          userId: jobSeekerIds[0],
          firstName: "John",
          lastName: "Doe",
          phone: "555-123-4567",
          location: "Chicago, IL",
          bio: "Experienced software engineer with a passion for web development.",
          resumeUrl: "https://example.com/resume/johndoe",
          skills: ["JavaScript", "React", "Node.js", "Python"],
          education: JSON.stringify([
            {
              degree: "B.S. Computer Science",
              institution: "University of Illinois",
              year: "2018"
            }
          ]),
          experience: JSON.stringify([
            {
              title: "Software Engineer",
              company: "Previous Tech",
              startDate: "2018-06",
              endDate: "2021-12",
              description: "Developed web applications using React and Node.js."
            }
          ])
        },
        {
          userId: jobSeekerIds[1],
          firstName: "Jane",
          lastName: "Smith",
          phone: "555-987-6543",
          location: "Seattle, WA",
          bio: "Full-stack developer specializing in modern JavaScript frameworks.",
          resumeUrl: "https://example.com/resume/janesmith",
          skills: ["TypeScript", "Angular", "Express", "MongoDB"],
          education: JSON.stringify([
            {
              degree: "M.S. Software Engineering",
              institution: "University of Washington",
              year: "2020"
            }
          ]),
          experience: JSON.stringify([
            {
              title: "Senior Developer",
              company: "Web Solutions Inc",
              startDate: "2020-01",
              endDate: null,
              description: "Leading development team for client projects."
            }
          ])
        },
        {
          userId: jobSeekerIds[2],
          firstName: "Michael",
          lastName: "Johnson",
          phone: "555-456-7890",
          location: "Los Angeles, CA",
          bio: "UI/UX designer with coding skills and a keen eye for user experience.",
          resumeUrl: "https://example.com/resume/mjohnson",
          skills: ["UI/UX Design", "Figma", "Adobe XD", "CSS", "JavaScript"],
          education: JSON.stringify([
            {
              degree: "B.A. Graphic Design",
              institution: "California Arts Institute",
              year: "2019"
            }
          ]),
          experience: JSON.stringify([
            {
              title: "UI Designer",
              company: "Creative Agency",
              startDate: "2019-03",
              endDate: "2022-01",
              description: "Designed user interfaces for web and mobile applications."
            }
          ])
        }
      ];
      
      for (const profile of jobSeekerProfilesData) {
        const validated = insertJobSeekerProfileSchema.parse(profile);
        await db.insert(jobSeekerProfiles).values(validated);
        
        // Mark user profiles as completed
        await db.update(users)
          .set({ profileCompleted: true })
          .where(eq(users.id, profile.userId));
      }
      console.log(`✅ Seeded ${jobSeekerProfilesData.length} job seeker profiles`);
      
      // Seed jobs
      console.log("Seeding jobs...");
      const jobsData = [
        {
          employerId: employerIds[0],
          title: "Senior Frontend Developer",
          description: "We're looking for an experienced frontend developer to join our team and help build cutting-edge web applications for our clients.",
          qualifications: "5+ years of experience with modern JavaScript frameworks, strong understanding of web performance optimization, and excellent problem-solving skills.",
          responsibilities: "Design and implement user interfaces, collaborate with UX designers, optimize application performance, and mentor junior developers.",
          location: "San Francisco, CA",
          jobType: "full-time",
          salaryMin: "120000",
          salaryMax: "160000",
          skills: ["React", "TypeScript", "CSS", "HTML", "Redux"],
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        },
        {
          employerId: employerIds[0],
          title: "DevOps Engineer",
          description: "Join our infrastructure team to help us build and maintain scalable cloud solutions for our growing products.",
          qualifications: "Experience with AWS/Azure, containerization, CI/CD pipelines, and infrastructure as code. Knowledge of security best practices.",
          responsibilities: "Set up and maintain CI/CD pipelines, manage cloud infrastructure, optimize performance and costs, implement security measures.",
          location: "Remote",
          jobType: "full-time",
          salaryMin: "130000",
          salaryMax: "170000",
          skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
          isActive: true,
          expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
        },
        {
          employerId: employerIds[1],
          title: "Machine Learning Engineer",
          description: "Help us develop cutting-edge AI solutions for real-world problems in various industries.",
          qualifications: "MS or PhD in Computer Science, Machine Learning, or related field. Experience with deep learning frameworks and natural language processing.",
          responsibilities: "Design and implement machine learning models, process and analyze large datasets, collaborate with product teams on AI features.",
          location: "Austin, TX",
          jobType: "full-time",
          salaryMin: "140000",
          salaryMax: "180000",
          skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
          isActive: true,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
        },
        {
          employerId: employerIds[1],
          title: "UX/UI Designer",
          description: "We're seeking a talented UX/UI Designer to create beautiful, functional interfaces for our products.",
          qualifications: "3+ years of experience in user interface design, proficiency with design tools, portfolio demonstrating UX thinking.",
          responsibilities: "Create wireframes and prototypes, conduct user research, collaborate with developers on implementation, design system maintenance.",
          location: "Austin, TX",
          jobType: "full-time",
          salaryMin: "90000",
          salaryMax: "120000",
          skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        },
        {
          employerId: employerIds[2],
          title: "Backend Developer",
          description: "Join our team to build robust, secure, and scalable backend systems for financial applications.",
          qualifications: "Experience with server-side programming, database design, and API development. Knowledge of security and compliance in finance.",
          responsibilities: "Design and implement APIs, database architecture, security controls, and integration with third-party services.",
          location: "New York, NY",
          jobType: "full-time",
          salaryMin: "110000",
          salaryMax: "150000",
          skills: ["Java", "Spring", "SQL", "MongoDB", "RESTful APIs"],
          isActive: true,
          expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
        },
        {
          employerId: employerIds[2],
          title: "Data Analyst Intern",
          description: "Exciting opportunity for students to gain hands-on experience in data analysis for a financial services company.",
          qualifications: "Currently pursuing a degree in Computer Science, Statistics, or related field. Basic knowledge of SQL and data visualization.",
          responsibilities: "Assist in data collection and cleaning, create reports and visualizations, help identify trends and insights.",
          location: "New York, NY",
          jobType: "internship",
          salaryMin: "25",
          salaryMax: "35",
          skills: ["SQL", "Excel", "PowerBI", "Python", "Statistics"],
          isActive: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
        },
        {
          employerId: employerIds[0],
          title: "Product Manager",
          description: "We're looking for a product manager to lead product development and strategy for our main application.",
          qualifications: "3+ years of experience in product management, preferably in SaaS. Strong understanding of software development and UX design.",
          responsibilities: "Define product vision and roadmap, gather and prioritize requirements, work with development teams on implementation.",
          location: "San Francisco, CA",
          jobType: "full-time",
          salaryMin: "130000",
          salaryMax: "170000",
          skills: ["Product Strategy", "User Stories", "Agile", "Roadmapping", "Analytics"],
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        },
        {
          employerId: employerIds[1],
          title: "Mobile Developer (iOS)",
          description: "Join our mobile team to develop innovative iOS applications using Swift and modern architecture patterns.",
          qualifications: "Experience with iOS development using Swift, knowledge of iOS design patterns, and familiarity with the Apple ecosystem.",
          responsibilities: "Design and develop iOS applications, implement UI/UX designs, optimize performance, collaborate with backend teams.",
          location: "Remote",
          jobType: "contract",
          salaryMin: "70",
          salaryMax: "90",
          skills: ["Swift", "UIKit", "SwiftUI", "Core Data", "iOS"],
          isActive: true,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
        }
      ];
      
      for (const job of jobsData) {
        const validated = insertJobSchema.parse(job);
        await db.insert(jobs).values(validated);
      }
      console.log(`✅ Seeded ${jobsData.length} jobs`);
      
    } else {
      console.log("📝 Users already exist, skipping seed data");
    }

    console.log("✅ Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
