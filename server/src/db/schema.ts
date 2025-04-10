import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passwordHash: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const charactersTable = pgTable('characters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaignsTable = pgTable('campaigns', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const encountersTable = pgTable('encounters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monstersTable = pgTable('encounters', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

//
// Since Player characters and monster characters are their own tables
// have separate condition tables for them, even though they share the same schema
//

const createConditionsTable = (name: string) =>
  pgTable(name, {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });

export const characterConditionsTable = createConditionsTable('character_conditions');

export const monsterConditionsTable = createConditionsTable('monster_conditions');

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
  characterConditions: many(characterConditionsTable),
  characters: many(charactersTable),
  monsterConditions: many(monsterConditionsTable),
  monsters: many(monstersTable),
}));
