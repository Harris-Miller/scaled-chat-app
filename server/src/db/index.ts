import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

export const db = drizzle(process.env.DATABASE_URL);
