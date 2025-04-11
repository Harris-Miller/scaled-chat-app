import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/db/schema.ts',
});
