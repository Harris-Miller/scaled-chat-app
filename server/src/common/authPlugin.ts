/* eslint-disable */
import { jwt as jwtPlugin } from '@elysiajs/jwt';
import type { Elysia } from 'elysia';

import { db } from '../db';
import { usersTable } from '../db/schema';

import { jwtInstance } from './jwt';

const AuthPlugin = (app: Elysia) =>
  app
    .use(
      jwtPlugin({
        name: 'jwt',
        secret: 'beyond',
      }),
    )
    .derive(async ({ jwt, cookie: { accessToken, refreshToken }, set }) => {
      if (!accessToken?.value) {
        // handle error for access token is not available
        set.status = 'Unauthorized';
        throw new Error('Access token is missing');
      }
      const jwtPayload = await jwt.verify(accessToken.value);
      if (!jwtPayload) {
        // handle error for access token is tempted or incorrect
        set.status = 'Forbidden';
        throw new Error('Access token is invalid');
      }

      const userId = jwtPayload.sub!;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        // handle error for user not found from the provided access token
        set.status = 'Forbidden';
        throw new Error('Access token is invalid');
      }

      // implement single session based on redis to make sure that token is same with the new
      const redisToken = await RedisClientConfig.hGetAll(userId);

      if (redisToken.refresh_token !== refreshToken.value) {
        set.status = 'Unauthorized';
        throw new Error('Refresh token is invalid');
      }

      return {
        user,
      };
    });

export { AuthPlugin };
