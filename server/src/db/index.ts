import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';

import * as schema from './schema';

export const db = drizzle({ casing: 'snake_case', connection: process.env.DATABASE_URL, schema });

export const seedDb = async () => {
  // seed
  reset(db, schema);
  console.log('db reset');

  const passwordHash = await Bun.password.hash('foobar123**');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  console.log('seeding complete');
};
