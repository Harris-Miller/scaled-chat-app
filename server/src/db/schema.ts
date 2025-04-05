import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const usersTable = pgTable('users', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  token: varchar({ length: 26 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const charactersTable = pgTable('characters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaignsTable = pgTable('campaigns', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const encountersTable = pgTable('encounters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monstersTable = pgTable('encounters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id')
    .$defaultFn(() => ulid())
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

//
// Relations
//

export const usersRelations = relations(usersTable, ({ many }) => ({
  campaigns: many(campaignsTable),
  characters: many(charactersTable),
}));

export const campaignsRelations = relations(campaignsTable, ({ one, many }) => ({
  characters: many(charactersTable),
  encounters: many(encountersTable),
  owner: one(usersTable),
}));

export const encountersRelations = relations(encountersTable, ({ many }) => ({
  monsters: many(monstersTable),
}));
