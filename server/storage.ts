import { db } from "../db";
import { users, User as SelectUser, InsertUser } from "../shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { Pool } from '@neondatabase/serverless';
import { DATABASE_URL } from '../drizzle.config';

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByUsername(username: string): Promise<SelectUser | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  sessionStore: any; // Using any type for session store as the type definitions are not available
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type for session store as the type definitions are not available
  private pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: DATABASE_URL });
    
    this.sessionStore = new PostgresSessionStore({ 
      pool: this.pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<SelectUser | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    return result;
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
