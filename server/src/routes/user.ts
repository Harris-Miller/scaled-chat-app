import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getRandomValues } from 'node:crypto';

import { authService } from '../common/authService';
import { db } from '../db';
import { users } from '../db/schema';

export const userRoute = new Elysia({ prefix: '/user' })
  .use(authService)
  .post(
    '/sign-up',
    async ({ body: { email, password }, store, error, cookie: { token } }) => {
      console.log('user/sign-up');
      const user = await db.$count(users, eq(users.email, email));

      // bail if email already in use
      if (user !== 0)
        return error(400, {
          message: 'User already exists',
          success: false,
        });

      const passwordHash = await Bun.password.hash(password);

      await db.insert(users).values({
        displayName: '',
        email,
        passwordHash,
      });

      const key = getRandomValues(new Uint32Array(1))[0]!;
      store.session[key] = email;
      token.value = key;

      return {
        message: `User created. Signed in as ${email}`,
        success: true,
      };
    },
    {
      body: 'signIn',
      cookie: 'session',
    },
  )
  .post(
    '/sign-in',
    async ({ store: { session }, error, body: { email, password }, cookie: { token } }) => {
      console.log('user/sign-in');

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then(users => users[0]);

      if (user == null || !(await Bun.password.verify(password, user.passwordHash)))
        return error(400, {
          message: 'Invalid username or password',
          success: false,
        });

      const key = getRandomValues(new Uint32Array(1))[0]!;
      session[key] = email;
      token.value = key;

      return {
        message: `Signed in as ${email}`,
        success: true,
      };
    },
    {
      body: 'signIn',
      cookie: 'session',
    },
  )
  .get(
    '/sign-out',
    ({ cookie: { token } }) => {
      console.log('user/sign-out');
      token.remove();

      return {
        message: 'Signed out',
        success: true,
      };
    },
    {
      cookie: 'session',
    },
  )
  .get(
    '/profile',
    async ({ cookie: { token }, store: { session }, error }) => {
      console.log('user/profile');
      const email = session[token.value!]!;

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then(results => results[0]);

      if (user == null) {
        return error(500, {
          message: 'Unable to find user for token',
          success: false,
        });
      }

      return {
        email,
        success: true,
      };
    },
    {
      cookie: 'session',
      isSignIn: true,
    },
  );
