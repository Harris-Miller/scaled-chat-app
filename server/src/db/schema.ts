import { relations } from 'drizzle-orm';
import { char, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid as genNanoid } from 'nanoid';

const nanoid = () => char({ length: 21 });

//
// Tables
//

export const users = pgTable('users', {
  createdAt: timestamp().defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: nanoid()
    .primaryKey()
    .$defaultFn(() => genNanoid()),
  passwordHash: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const rooms = pgTable('rooms', {
  adminId: nanoid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  description: text().notNull().default(''),
  id: nanoid()
    .primaryKey()
    .$defaultFn(() => genNanoid()),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const chats = pgTable('chats', {
  authorId: nanoid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  id: nanoid()
    .primaryKey()
    .$defaultFn(() => genNanoid()),
  roomId: nanoid()
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
    roomId: nanoid()
      .notNull()
      .references(() => rooms.id),
    userId: nanoid()
      .notNull()
      .references(() => users.id),
  },
  t => [primaryKey({ columns: [t.userId, t.roomId] })],
);

//
// Relations
//

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  usersToRooms: many(usersToRooms),
}));

export const chatRelations = relations(chats, ({ one }) => ({
  author: one(users, { fields: [chats.authorId], references: [users.id] }),
  room: one(rooms, { fields: [chats.roomId], references: [rooms.id] }),
}));

export const roomRelations = relations(rooms, ({ many }) => ({
  chats: many(chats),
  usersToRooms: many(usersToRooms),
}));

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
  room: one(rooms, { fields: [usersToRooms.roomId], references: [rooms.id] }),
  user: one(users, { fields: [usersToRooms.userId], references: [users.id] }),
}));
