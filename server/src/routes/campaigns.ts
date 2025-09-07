// @ts-nocheck
/* eslint-disable */
import { and, eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getUser } from '../common/authService';
import { db } from '../db';
import { campaigns } from '../db/schema';

export const campaignsRoute = new Elysia({ prefix: '/campaigns' })
  .use(getUser)
  .get('/', async ({ user }) => {
    console.log('/api/campaigns');

    const results = await db.select().from(campaigns).where(eq(campaigns.userId, user.id));

    return results;
  })
  .get('/:id', async ({ status, user, params: { id } }) => {
    console.log(`/api/campaign/${id}`);

    const result = await db.query.campaigns.findFirst({
      where: and(eq(campaigns.id, Number.parseInt(id, 10)), eq(campaigns.userId, user.id)),
    });

    if (result == null) {
      return status(404, {
        message: 'Not Found',
        success: false,
      });
    }

    return result;
  });
