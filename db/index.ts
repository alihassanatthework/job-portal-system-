import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import ws from 'ws';
import { DATABASE_URL } from '../drizzle.config';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

console.log('Database URL:', DATABASE_URL); // Debug log

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Please create a Neon database and add the connection string to your .env file');
}

const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });