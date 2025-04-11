import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

export const db = drizzle({ casing: 'snake_case', connection: process.env.DATABASE_URL, schema });
