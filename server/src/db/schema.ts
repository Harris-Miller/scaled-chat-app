import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const usersTable = pgTable('users', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
