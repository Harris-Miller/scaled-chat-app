import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';

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

export const seedDb = async () => {
  // seed
  reset(db, schema);
  console.log('db reset');

  const passwordHash = await Bun.password.hash('foobar123**');
  const user = await db
    .insert(schema.users)
    .values({ displayName: 'Harris', email: 'harris@awesome.com', passwordHash })
    .returning({ id: schema.users.id })
    .then(r => r[0]!);

  await db
    .insert(schema.users)
    .values({ displayName: 'Other', email: 'other@awesome.com', passwordHash })
    .returning({ id: schema.users.id })
    .then(r => r[0]!);

  await db.insert(schema.characters).values([
    { name: 'foo', userId: user.id },
    { name: 'bar', userId: user.id },
  ]);

  await db.insert(schema.campaigns).values([
    { name: 'campaign1', userId: user.id },
    { name: 'campaign2', userId: user.id },
  ]);

  console.log('seeding complete');
};
