import { Elysia, t } from 'elysia';

import { getRandomValues } from 'node:crypto';

const userService = new Elysia({ name: 'user/service' })
  .state({
    session: {} as Record<number, string>,
    user: {} as Record<string, string>,
  })
  .model({
    session: t.Optional(
      t.Cookie(
        {
          token: t.Number(),
        },
        {
          secrets: 'beyond',
        },
      ),
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
          if (token?.value == null)
            return error(401, {
              message: 'Unauthorized',
              success: false,
            });

          const email = session[token.value as unknown as number];

          if (email == null)
            return error(401, {
              message: 'Unauthorized',
              success: false,
            });

          return undefined;
        },
      };
    },
  });

export const users = new Elysia({ prefix: '/user' })
  .use(userService)
  .post(
    '/sign-up',
    async ({ body: { email, password }, store, error }) => {
      if (store.user[email] != null)
        return error(400, {
          message: 'User already exists',
          success: false,
        });

      store.user[email] = await Bun.password.hash(password);

      return {
        message: 'User created',
        success: true,
      };
    },
    {
      body: 'signIn',
    },
  )
  .post(
    '/sign-in',
    async ({ store: { user, session }, error, body: { email, password }, cookie: { token } }) => {
      console.log('in /sign-in');
      if (user[email] == null || !(await Bun.password.verify(password, user[email])))
        return error(400, {
          message: 'Invalid username or password',
          success: false,
        });

      const key = getRandomValues(new Uint32Array(1))[0]!;
      session[key] = email;
      // TODO, run-time error if we set cookie validation below, but when we don't we get a type error
      // @ts-expect-error
      token.value = key;

      return {
        message: `Signed in as ${email}`,
        success: true,
      };
    },
    {
      body: 'signIn',
      // cookie: 'optionalSession',
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
    ({ cookie: { token }, store: { session } }) => {
      const email = session[token.value];

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
