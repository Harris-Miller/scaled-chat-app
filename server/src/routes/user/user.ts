import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { db } from '../../db';
import { users } from '../../db/schema';

import { authRoutes } from './auth';
import { profileRoutes } from './profile';

const otherUsers = new Elysia().get('/:id', async function userRouteGetById({ status, params: { id } }) {
  const user = await db.query.users.findFirst({ columns: { passwordHash: false }, where: eq(users.id, id) });

  if (user == null) {
    return status(404, 'Not Found');
  }

  return status(200, user);
});

export const userRoute = new Elysia({ prefix: '/user' }).use(authRoutes).use(profileRoutes).use(otherUsers);
