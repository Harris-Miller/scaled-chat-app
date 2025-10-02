/* eslint-disable no-console */
import { reset, seed } from 'drizzle-seed';
import { monotonicFactory } from 'ulid';

import { db } from './db';
import * as schema from './schema';
import { randomChatGptGeneratedPhrases, roomIdSeeds, userIdSeeds } from './seedData';

const ulid = monotonicFactory();

const harrisId = '01K5D89QE73Q6H11QP051DP01E';

const roomNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

const rightNow = new Date();

export const seedDb = async () => {
  // seed
  reset(db, schema);
  console.log('db reset');

  const passwordHash = await Bun.password.hash('password123');

  await db.insert(schema.users).values({
    createdAt: rightNow,
    displayName: 'Harris',
    email: 'harris@email.com',
    id: harrisId,
    passwordHash,
    updatedAt: rightNow,
  });

  await seed(db, schema).refine(funcs => {
    return {
      chats: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          id: funcs.valuesFromArray({
            isUnique: true,
            values: Array(1200)
              .fill(undefined)
              .map(() => ulid()),
          }),
          text: funcs.valuesFromArray({ values: randomChatGptGeneratedPhrases }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 1250,
      },
      directMessages: {
        count: 0,
      },
      profilePics: {
        count: 0,
      },
      rooms: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          // adminId: funcs.valuesFromArray({ values: [harrisId] }),
          id: funcs.valuesFromArray({ isUnique: true, values: roomIdSeeds }),
          name: funcs.valuesFromArray({ isUnique: true, values: roomNames }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 8,
        with: {
          chats: 150,
        },
      },
      users: {
        columns: {
          // @ts-expect-error - false positive
          createdAt: funcs.valuesFromArray({ values: [rightNow] }),
          displayName: funcs.firstName({ isUnique: true }),
          email: funcs.email(),
          id: funcs.valuesFromArray({ isUnique: true, values: userIdSeeds }),
          passwordHash: funcs.default({ defaultValue: passwordHash }),
          // @ts-expect-error - false positive
          updatedAt: funcs.valuesFromArray({ values: [rightNow] }),
        },
        count: 50,
        with: {
          chats: 24,
        },
      },
    };
  });

  console.log('db seeded!');
};

await seedDb();
