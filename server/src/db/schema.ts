import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';

//
// Tables
//

export const users = pgTable('users', {
  createdAt: timestamp().defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passwordHash: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const rooms = pgTable('rooms', {
  adminId: integer()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  description: text().notNull().default(''),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const chats = pgTable('chats', {
  authorId: integer()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  roomId: integer()
    .notNull()
    .references(() => rooms.id),
  text: text().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersToRooms = pgTable(
  'users_to_rooms',
  {
    roomId: integer()
      .notNull()
      .references(() => rooms.id),
    userId: integer()
      .notNull()
      .references(() => users.id),
  },
  t => [primaryKey({ columns: [t.userId, t.roomId] })],
);

export const usersToChats = pgTable(
  'users_to_chats',
  {
    chatId: integer()
      .notNull()
      .references(() => chats.id),
    userId: integer()
      .notNull()
      .references(() => users.id),
  },
  t => [primaryKey({ columns: [t.userId, t.chatId] })],
);

//
// Relations
//

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  usersToChats: many(usersToChats),
  usersToRooms: many(usersToRooms),
}));

export const chatRelations = relations(chats, ({ one, many }) => ({
  author: one(users, { fields: [chats.authorId], references: [users.id] }),
  room: one(rooms, { fields: [chats.roomId], references: [rooms.id] }),
  usersToChats: many(usersToChats),
}));

export const roomRelations = relations(rooms, ({ many }) => ({
  chats: many(chats),
  usersToRooms: many(usersToRooms),
}));

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
  room: one(rooms, { fields: [usersToRooms.roomId], references: [rooms.id] }),
  user: one(users, { fields: [usersToRooms.userId], references: [users.id] }),
}));

export const usersToChatsRelations = relations(usersToChats, ({ one }) => ({
  chat: one(chats, { fields: [usersToChats.chatId], references: [chats.id] }),
  user: one(users, { fields: [usersToChats.userId], references: [users.id] }),
}));
