import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { authService, getUser } from '../common/authService';
import { db } from '../db';
import { users } from '../db/schema';

export const userRoute = new Elysia({ prefix: '/user' })
  .use(authService)
  .post(
    '/sign-up',
    async ({ body: { email, password }, createAccessToken, createRefreshToken, error }) => {
      console.log('user/sign-up');
      const user = await db.$count(users, eq(users.email, email));

      // bail if email already in use
      if (user !== 0)
        return error(400, {
          message: 'User already exists',
          success: false,
        });

      const passwordHash = await Bun.password.hash(password);

      const { userId } = await db
        .insert(users)
        .values({
          displayName: '',
          email,
          passwordHash,
        })
        .returning({ userId: users.id })
        .then(r => r[0]!); // TODO: is there a better way?

      const idAsString = userId.toString();
      await createAccessToken(idAsString);
      await createRefreshToken(idAsString);

      return {
        message: `User created. Signed in as ${email}`,
        success: true,
      };
    },
    {
      body: 'signIn',
    },
  )
  .post(
    '/sign-in',
    async ({ error, body: { email, password }, createAccessToken, createRefreshToken }) => {
      console.log('user/sign-in');

      const user = await db.query.users.findFirst({ where: eq(users.email, email) });

      if (user == null || !(await Bun.password.verify(password, user.passwordHash)))
        return error(400, {
          message: 'Invalid username or password',
          success: false,
        });

      const idAsString = user.id.toString();
      await createAccessToken(idAsString);
      await createRefreshToken(idAsString);

      return {
        message: `Signed in as ${email}`,
        success: true,
      };
    },
    {
      body: 'signIn',
    },
  )
  .get('/sign-out', ({ cookie: { accessToken, refreshToken } }) => {
    console.log('user/sign-out');
    accessToken?.remove();
    refreshToken?.remove();

    return {
      message: 'Signed out',
      success: true,
    };
  })
  .use(getUser)
  .get('/profile', ({ user }) => {
    console.log('user/profile');

    return {
      email: user.email,
      success: true,
    };
  });
