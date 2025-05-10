import type { Config } from "drizzle-kit";

export const DATABASE_URL = "postgresql://neondb_owner:npg_bgdlRF2kt6pU@ep-gentle-dust-a1fzqo5f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

export default {
  schema: "./shared/schema.ts",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL
  }
} satisfies Config;
