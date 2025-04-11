import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp().defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passwordHash: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const campaigns = pgTable('campaigns', {
  createdAt: timestamp().defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id),
});

export const characters = pgTable('characters', {
  campaignId: integer().references(() => campaigns.id),
  createdAt: timestamp().defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id),
});

export const encounters = pgTable('encounters', {
  campaignId: integer()
    .notNull()
    .references(() => campaigns.id),
  createdAt: timestamp().defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const monsters = pgTable('monsters', {
  createdAt: timestamp().defaultNow().notNull(),
  encounterId: integer()
    .notNull()
    .references(() => encounters.id),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

//
// Since Player characters and monster characters are their own tables
// have separate condition tables for them, even though they share the same schema
//

const createConditionsTable = (name: string) =>
  pgTable(name, {
    createdAt: timestamp().defaultNow().notNull(),
    encounterId: integer()
      .notNull()
      .references(() => encounters.id),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    updatedAt: timestamp().defaultNow().notNull(),
  });

export const characterConditions = createConditionsTable('character_conditions');

export const monsterConditions = createConditionsTable('monster_conditions');

//
// Relations
//

export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ one }) => ({
  campaign: one(campaigns, { fields: [characters.campaignId], references: [campaigns.id] }),
  owner: one(users, { fields: [characters.userId], references: [users.id] }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  characters: many(characters),
  encounters: many(encounters),
  owner: one(users, { fields: [campaigns.userId], references: [users.id] }),
}));

export const encountersRelations = relations(encounters, ({ many, one }) => ({
  campaign: one(campaigns, { fields: [encounters.campaignId], references: [campaigns.id] }),
  characterConditions: many(characterConditions),
  monsterConditions: many(monsterConditions),
  monsters: many(monsters),
}));

export const monstersRelations = relations(monsters, ({ one }) => ({
  encounters: one(encounters, { fields: [monsters.encounterId], references: [encounters.id] }),
}));

export const characterConditionsRelations = relations(characterConditions, ({ one }) => ({
  encounters: one(encounters, { fields: [characterConditions.encounterId], references: [encounters.id] }),
}));

export const monsterConditionsRelations = relations(monsterConditions, ({ one }) => ({
  encounters: one(encounters, { fields: [monsterConditions.encounterId], references: [encounters.id] }),
}));
