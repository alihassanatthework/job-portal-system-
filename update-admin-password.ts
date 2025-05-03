import { db } from "./db";
import { users } from "./shared/schema";
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
    console.log("🔐 Updating admin password...");

    // Find the admin user
    const adminUser = await db.query.users.findFirst({
      where: eq(users.userType, "admin")
    });

    if (!adminUser) {
      console.log("❌ Admin user not found!");
      return;
    }

    // Hash the new password
    const hashedPassword = await hashPassword("admin1");

    // Update the admin username and password
    await db.update(users)
      .set({ 
        username: "admin",
        password: hashedPassword 
      })
      .where(eq(users.id, adminUser.id));

    console.log(`✅ Admin password updated for user: ${adminUser.username}`);
  } catch (error) {
    console.error("Error updating admin password:", error);
  } finally {
    process.exit(0);
  }
}

updateAdminPassword();