import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getUser } from '../common/authService';
import { db } from '../db';
import { campaigns } from '../db/schema';

export const campaignsRoute = new Elysia({ prefix: '/campaigns' }).use(getUser).get(
  '/',
  async ({ user }) => {
    console.log('/api/campaigns');

    const results = await db.select().from(campaigns).where(eq(campaigns.userId, user.id));

    return {
      campaigns: results,
      message: `Test fetch for /api/campaigns from user: ${user.email}`,
      success: true,
    };
  },
  {
    isSignIn: true,
  },
);
