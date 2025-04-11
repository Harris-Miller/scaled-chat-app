import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getUser } from '../common/authService';
import { db } from '../db';
import { characters } from '../db/schema';

export const charactersRoute = new Elysia({ prefix: '/characters' }).use(getUser).get(
  '/',
  async ({ user }) => {
    console.log('/api/characters');

    const results = await db.select().from(characters).where(eq(characters.userId, user.id));

    return {
      characters: results,
      message: `Test fetch for /api/characters from user: ${user.email}`,
      success: true,
    };
  },
  {
    isSignIn: true,
  },
);
