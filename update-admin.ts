import { db } from "./db/index";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function updateAdminPassword() {
  try {
    console.log("🔄 Updating admin user password...");
    
    // Check if admin user exists
    const adminUser = await db.query.users.findFirst({
      where: eq(users.username, "admin")
    });
    
    if (adminUser) {
      // Update the admin password to "admin"
      await db.update(users)
        .set({ 
          password: await hashPassword("admin"),
          userType: "admin" // Ensure the user type is set to admin
        })
        .where(eq(users.username, "admin"));
      
      console.log("✅ Admin password updated to 'admin'");
    } else {
      // Create a new admin user
      const adminUserData = {
        username: "admin",
        password: await hashPassword("admin"),
        email: "admin@jobportal.com",
        userType: "admin"
      };
      
      const [newAdmin] = await db.insert(users).values(adminUserData).returning();
      console.log(`✅ Created new admin user: ${newAdmin.username}`);
    }
  } catch (error) {
    console.error("Error updating admin user:", error);
  }
}

updateAdminPassword();