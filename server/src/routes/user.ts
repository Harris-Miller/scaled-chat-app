import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { authService, getUser } from '../common/authService';
import { db } from '../db';
import { users } from '../db/schema';

export const userRoute = new Elysia({ prefix: '/user' })
  .use(authService)
  .model({
    signIn: t.Object({
      email: t.String({ minLength: 5 }),
      password: t.String({ minLength: 8 }),
    }),
  })
  .post(
    '/sign-up',
    async function userRoutePostSignUp({ body: { email, password }, createAccessToken, createRefreshToken, status }) {
      const user = await db.$count(users, eq(users.email, email));

      // bail if email already in use
      if (user !== 0)
        return status(400, {
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
    async function userRoutePostSignIn({ status, body: { email, password }, createAccessToken, createRefreshToken }) {
      const user = await db.query.users.findFirst({ where: eq(users.email, email) });

      if (user == null || !(await Bun.password.verify(password, user.passwordHash)))
        return status(400, {
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
  .get('/sign-out', function userRouteGetSignOut({ cookie: { accessToken, refreshToken } }) {
    accessToken?.remove();
    refreshToken?.remove();

    return {
      message: 'Signed out',
      success: true,
    };
  })
  .use(getUser)
  .get('/profile', function userRouteGetProfile({ user }) {
    return {
      displayName: user.displayName,
      email: user.email,
      id: user.id,
    };
  });
