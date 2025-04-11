import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getUser } from '../common/authService';
import { db } from '../db';
import { characters } from '../db/schema';

export const charactersRoute = new Elysia({ prefix: '/characters' }).use(getUser).get(
  '/:id',
  async ({ params: { id }, user }) => {
    console.log('characters/:id', id);

    // const character = await db.select().from(characters).where();

    return {
      message: `Test fetch for characters/${id} from user: ${user.email}`,
      success: true,
    };
  },
  {
    isSignIn: true,
  },
);
