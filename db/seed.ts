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

    // Clear existing data
    await db.delete(jobs);
    await db.delete(jobSeekerProfiles);
    await db.delete(employerProfiles);
    await db.delete(users);

    // Create sample job seekers
    const jobSeeker1 = await db.insert(users).values({
      username: 'john_doe',
      password: await hashPassword('password123'),
      email: 'john.doe@example.com',
      userType: 'job_seeker',
      profileCompleted: true
    }).returning();

    const jobSeeker2 = await db.insert(users).values({
      username: 'jane_smith',
      password: await hashPassword('password123'),
      email: 'jane.smith@example.com',
      userType: 'job_seeker',
      profileCompleted: true
    }).returning();

    // Create sample employers
    const employer1 = await db.insert(users).values({
      username: 'tech_corp',
      password: await hashPassword('password123'),
      email: 'hr@techcorp.com',
      userType: 'employer',
      profileCompleted: true
    }).returning();

    const employer2 = await db.insert(users).values({
      username: 'design_studio',
      password: await hashPassword('password123'),
      email: 'careers@designstudio.com',
      userType: 'employer',
      profileCompleted: true
    }).returning();

    // Create job seeker profiles
    await db.insert(jobSeekerProfiles).values([
      {
        userId: jobSeeker1[0].id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        location: 'New York, USA',
        bio: 'Experienced software developer with 5 years of experience in web development.',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of Technology',
            year: '2018'
          }
        ],
        experience: [
          {
            title: 'Senior Developer',
            company: 'Tech Solutions Inc',
            duration: '2020 - Present',
            description: 'Leading development team and implementing new features'
          }
        ]
      },
      {
        userId: jobSeeker2[0].id,
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1987654321',
        location: 'London, UK',
        bio: 'UI/UX designer with a passion for creating beautiful and functional interfaces.',
        skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
        education: [
          {
            degree: 'Master of Design',
            field: 'User Experience',
            institution: 'Design Academy',
            year: '2019'
          }
        ],
        experience: [
          {
            title: 'UI Designer',
            company: 'Creative Agency',
            duration: '2019 - Present',
            description: 'Designing user interfaces for various clients'
          }
        ]
      }
    ]);

    // Create employer profiles
    await db.insert(employerProfiles).values([
      {
        userId: employer1[0].id,
        companyName: 'Tech Corporation',
        industry: 'Technology',
        companySize: '1000+',
        location: 'San Francisco, USA',
        website: 'https://techcorp.com',
        description: 'Leading technology company specializing in software solutions'
      },
      {
        userId: employer2[0].id,
        companyName: 'Design Studio',
        industry: 'Design',
        companySize: '50-200',
        location: 'London, UK',
        website: 'https://designstudio.com',
        description: 'Creative design agency focused on digital experiences'
      }
    ]);

    // Create sample jobs
    await db.insert(jobs).values([
      {
        employerId: employer1[0].id,
        title: 'Senior Software Engineer',
        description: 'Looking for an experienced software engineer to join our team.',
        qualifications: '5+ years of experience with modern JavaScript frameworks, strong understanding of web performance optimization, and excellent problem-solving skills.',
        responsibilities: 'Design and implement user interfaces, collaborate with UX designers, optimize application performance, and mentor junior developers.',
        location: 'San Francisco, USA',
        jobType: 'full-time',
        salaryMin: '120000',
        salaryMax: '160000',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        isActive: true
      },
      {
        employerId: employer2[0].id,
        title: 'UI/UX Designer',
        description: 'Join our creative team as a UI/UX designer.',
        qualifications: '3+ years of experience in user interface design, proficiency with design tools, portfolio demonstrating UX thinking.',
        responsibilities: 'Create wireframes and prototypes, conduct user research, collaborate with developers on implementation, design system maintenance.',
        location: 'London, UK',
        jobType: 'full-time',
        salaryMin: '80000',
        salaryMax: '100000',
        skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
        isActive: true
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
