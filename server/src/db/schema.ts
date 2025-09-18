import { relations } from 'drizzle-orm';
import { boolean, char, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ulid as getUlid } from 'ulid';

const ulid = () => char({ length: 26 });

//
// Tables
//

export const users = pgTable('users', {
  createdAt: timestamp().defaultNow().notNull(),
  displayName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  id: ulid()
    .primaryKey()
    .$defaultFn(() => getUlid()),
  passwordHash: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const profilePics = pgTable('profile_pics', {
  contentType: varchar('20').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  id: ulid()
    .primaryKey()
    .$defaultFn(() => getUlid()),
  // must do to avoid circular reference with drizzle
  selected: boolean().notNull(),
  success: boolean().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: ulid()
    .notNull()
    .references(() => users.id),
});

export const rooms = pgTable('rooms', {
  // adminId: ulid()
  //   .notNull()
  //   .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  description: text().notNull().default(''),
  id: ulid()
    .primaryKey()
    .$defaultFn(() => getUlid()),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const chats = pgTable('chats', {
  authorId: ulid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  id: ulid()
    .primaryKey()
    .$defaultFn(() => getUlid()),
  roomId: ulid()
    .notNull()
    .references(() => rooms.id),
  text: text().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const directMessages = pgTable('direct_messages', {
  createdAt: timestamp().defaultNow().notNull(),

  id: ulid()
    .primaryKey()
    .$defaultFn(() => getUlid()),
  text: text().notNull(),

  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// export const usersToRooms = pgTable(
//   'users_to_rooms',
//   {
//     roomId: ulid()
//       .notNull()
//       .references(() => rooms.id),
//     userId: ulid()
//       .notNull()
//       .references(() => users.id),
//   },
//   t => [primaryKey({ columns: [t.userId, t.roomId] })],
// );

export const usersToDirectMessages = pgTable(
  'users_to_direct_messages',
  {
    fromId: ulid()
      .notNull()
      .references(() => users.id),
    toId: ulid()
      .notNull()
      .references(() => users.id),
  },
  t => [primaryKey({ columns: [t.fromId, t.toId] })],
);

//
// Relations
//

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  profilePics: many(profilePics),
  // usersToRooms: many(usersToRooms),
}));

export const profilePicRelations = relations(profilePics, ({ one }) => ({
  user: one(users, { fields: [profilePics.userId], references: [users.id] }),
}));

export const chatRelations = relations(chats, ({ one }) => ({
  author: one(users, { fields: [chats.authorId], references: [users.id] }),
  room: one(rooms, { fields: [chats.roomId], references: [rooms.id] }),
}));

export const roomRelations = relations(rooms, ({ many }) => ({
  chats: many(chats),
  // usersToRooms: many(usersToRooms),
}));

// export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
//   room: one(rooms, { fields: [usersToRooms.roomId], references: [rooms.id] }),
//   user: one(users, { fields: [usersToRooms.userId], references: [users.id] }),
// }));

export const usersToDirectMessagesRelations = relations(usersToDirectMessages, ({ one }) => ({
  from: one(users, {
    fields: [usersToDirectMessages.fromId],
    references: [users.id],
  }),
  to: one(users, {
    fields: [usersToDirectMessages.toId],
    references: [users.id],
  }),
}));
