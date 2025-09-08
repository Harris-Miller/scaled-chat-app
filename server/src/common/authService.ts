import { jwt as jwtConstructor } from '@elysiajs/jwt';
import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { db } from '../db';
import { users } from '../db/schema';
import { getRedisClient } from '../redis/redisClient';

export const ACCESS_TOKEN_EXP = 60 * 24; // 1 day in seconds
export const REFRESH_TOKEN_EXP = 60 * 24 * 7; // 7 days in seconds

const getExpTimestamp = (seconds: number) => {
  const currentTimeMs = Date.now();
  const secondsIntoMs = seconds * 1000;
  const expirationTimeMs = currentTimeMs + secondsIntoMs;

  return Math.floor(expirationTimeMs / 1000);
};

// const createIat = () => Math.floor(Date.now() / 1000); // needs to be in seconds, not milliseconds

export const authService = new Elysia({ name: 'auth/service' })
  .use(
    jwtConstructor({
      name: 'jwt',
      secret: 'beyond',
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { accessToken, refreshToken } }) => {
    return {
      createAccessToken: async (sub: string) => {
        const accessJWTToken = await jwt.sign({
          exp: getExpTimestamp(ACCESS_TOKEN_EXP),
          iat: true,
          sub,
        });

        // TODO: figure out how how to make this cookie always defined
        accessToken!.set({
          httpOnly: true,
          maxAge: ACCESS_TOKEN_EXP,
          path: '/',
          sameSite: 'lax',
          secure: true,
          value: accessJWTToken,
        });

        return accessJWTToken;
      },
      createRefreshToken: async (sub: string) => {
        const refreshJWTToken = await jwt.sign({
          exp: getExpTimestamp(REFRESH_TOKEN_EXP),
          iat: true,
          sub,
        });

        // TODO: figure out how how to make this cookie always defined
        refreshToken!.set({
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXP,
          path: '/',
          sameSite: 'lax',
          secure: true,
          value: refreshJWTToken,
        });

        await getRedisClient().hSet(`user:jwt:${sub}`, 'refresh_token', refreshJWTToken);

        return refreshJWTToken;
      },
    };
  });

export const getUser = new Elysia()
  .use(authService)
  .guard({
    cookie: t.Cookie(
      {
        accessToken: t.Optional(t.String()),
        refreshToken: t.Optional(t.String()),
      },
      {
        httpOnly: true,
        secrets: 'beyond',
        secure: true,
      },
    ),
  })
  .onBeforeHandle(
    async ({ cookie: { accessToken, refreshToken }, status, jwt, createAccessToken, createRefreshToken }) => {
      if (accessToken.value == null) {
        if (refreshToken.value == null) {
          accessToken.remove();
          refreshToken.remove();
          return status(401, 'no access or refresh token');
        }

        const jwtPayload = await jwt.verify(refreshToken.value);
        if (jwtPayload === false || jwtPayload.sub == null) {
          accessToken.remove();
          refreshToken.remove();
          return status(401, 'failed to verify refresh token');
        }

        const storedRefreshToken = await getRedisClient().hGet(`user:jwt:${jwtPayload.sub}`, 'refresh_token');
        if (refreshToken.value !== storedRefreshToken) {
          accessToken.remove();
          refreshToken.remove();
          return status(403, 'you dare! (tampered refresh token)');
        }

        await createAccessToken(jwtPayload.sub);
        await createRefreshToken(jwtPayload.sub);

        return undefined;
      }

      const jwtPayload = await jwt.verify(accessToken.value);
      if (jwtPayload === false) {
        accessToken.remove();
        refreshToken.remove();
        return status(401, 'failed to verify access token');
      }

      return undefined;
    },
  )
  .resolve(async ({ cookie: { accessToken, refreshToken }, jwt, status }) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    const jwtPayload = await jwt.verify(accessToken.value);
    if (jwtPayload === false) {
      return status(401);
    }

    if (jwtPayload.sub == null) {
      return status(401);
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, jwtPayload.sub) });
    if (user == null) {
      return status(403);
    }

    return { user };
  })
  .as('global');
