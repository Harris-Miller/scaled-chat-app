import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { getRandomValues } from 'node:crypto';

import { db } from '../db';
import { usersTable } from '../db/schema';

const userService = new Elysia({ name: 'user/service' })
  .state({
    session: {} as Record<number, string>,
  })
  .model({
    session: t.Cookie(
      {
        token: t.Optional(t.Number()),
      },
      {
        secrets: 'beyond',
      },
    ),
    signIn: t.Object({
      email: t.String({ minLength: 3 }),
      password: t.String({ minLength: 8 }),
    }),
  })
  .macro({
    isSignIn: (enabled: boolean) => {
      if (!enabled) return undefined;

      return {
        beforeHandle: ({ error, cookie: { token }, store: { session } }) => {
          if (token?.value == null) {
            token?.remove();
            return error(401, {
              message: 'Unauthorized',
              success: false,
            });
          }

          const email = session[token.value as unknown as number];

          if (email == null) {
            token.remove();
            return error(401, {
              message: 'Unauthorized',
              success: false,
            });
          }

          return undefined;
        },
      };
    },
  });

export const userRoute = new Elysia({ prefix: '/user' })
  .use(userService)
  .post(
    '/sign-up',
    async ({ body: { email, password }, store, error, cookie: { token } }) => {
      const user = await db.$count(usersTable, eq(usersTable.email, email));

      // bail if email already in use
      if (user !== 0)
        return error(400, {
          message: 'User already exists',
          success: false,
        });

      const passwordHash = await Bun.password.hash(password);

      await db.insert(usersTable).values({
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
      console.log('in /sign-in');

      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
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
      const email = session[token.value!]!;

      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then(users => users[0]);

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
