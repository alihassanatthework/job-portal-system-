import { config } from 'dotenv';
import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env');

config({ path: envPath });

export const DATABASE_URL = process.env.DATABASE_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET; 