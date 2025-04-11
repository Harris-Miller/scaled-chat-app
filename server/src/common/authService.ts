import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { db } from '../db';
import { users } from '../db/schema';

export const authService = new Elysia({ name: 'auth/service' })
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
      email: t.String({ minLength: 5 }),
      password: t.String({ minLength: 8 }),
    }),
  })
  .macro({
    isSignIn: (enabled: boolean) => {
      console.log('macro::inSignIn');
      if (!enabled) return undefined;

      return {
        beforeHandle: async ({ error, cookie: { token }, store: { session } }) => {
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

          const [userObj] = await db
            .select({
              userEmail: users.email,
              userId: users.id,
            })
            .from(users)
            .where(eq(users.email, email));

          // return error if email from session doesn't exist in DB
          // logically this should never happen, but always cover your edge-cases
          if (userObj == null) {
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

export const getUser = new Elysia()
  .use(authService)
  .guard({
    cookie: 'session',
    isSignIn: true,
  })
  .resolve(async ({ cookie: { token }, store: { session } }) => {
    // assert we have token since we can't get here without beforeHandle letting us through
    const email = session[token.value as unknown as number]!;

    // assume user is in DB, TODO: what if not? I cannot `return error()` from here like in beforeHandle
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(result => result[0]!);

    return {
      user,
    };
  })
  .as('plugin');
