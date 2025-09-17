import { and, eq, gt, lt } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { Result } from 'try';

import { getUser } from '../../common/authService';
import { db } from '../../db';
import { chats, rooms } from '../../db/schema';
import { logger } from '../../logger';
import { io } from '../../socket';

export const chatRoutes = new Elysia()
  .use(getUser)
  .get(
    '/:id/chats',
    async function roomsRouteGetIdChats({ status, params: { id }, query: { after, before, limit, offset } }) {
      // for querying... limit always applies, defaults to 20
      // then from highest to lowest priority: before, after, offset
      // if no are passed, query is from `createdAt` started at most recent (may add in additional query abilities later)
      // when `after` is selected, it's from that date _forward
      // limit: Infinity is acceptable
      const positionClause = (() => {
        if (before != null) {
          return lt(chats.createdAt, new Date(before));
        }
        if (after != null) {
          return gt(chats.createdAt, new Date(after));
        }

        return null;
      })();

      const eqClause = eq(chats.roomId, id);

      const whereClause = positionClause != null ? and(eqClause, positionClause) : eqClause;

      const [isRoomChatsOk, roomChatsErr, roomChats] = await Result.try(async () => {
        const result = await db.query.chats.findMany({
          limit: limit === 0 ? undefined : (limit ?? 20),
          offset: offset ?? 0,
          where: whereClause,
        });
        return result;
      });

      if (!isRoomChatsOk) {
        return status(500, {
          error: (roomChatsErr as Error).message,
          success: false,
        });
      }

      return status(200, roomChats);
    },
    {
      query: t.Object({
        // TODO: make this discriminating unions
        after: t.Optional(t.String({ format: 'date-time' })),
        before: t.Optional(t.String({ format: 'date-time' })),
        limit: t.Optional(t.Integer({ minimum: 0 })),
        offset: t.Optional(t.Integer({ minimum: 0 })),
      }),
    },
  )
  .post(
    '/:id/chats',
    async function roomsRoutePostIdChats({ status, body: { text }, params: { id }, user }) {
      const doesRoomExist = (await db.$count(rooms, eq(rooms.id, id))) === 1;

      if (!doesRoomExist) {
        return status(400, {
          error: `Room "${id}" does not exist`,
          success: false,
        });
      }

      const newChat = await db
        .insert(chats)
        .values({
          authorId: user.id,
          roomId: id,
          text,
        })
        .returning()
        .then(d => d[0]);

      if (newChat == null) {
        return status(422, {
          message: 'unknown error during chat creation process',
          success: false,
        });
      }

      // uncomment to test redis load
      // fire and forget

      logger.silly(`New chat created: ${JSON.stringify(newChat)}`);

      io.to(`room:${id}`).emit('chat', newChat);

      return status(201, newChat);
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    },
  )
  .get('/:id/chats/count', async function roomsRoutePostIdChatsCount({ status, params: { id } }) {
    const doesRoomExist = (await db.$count(rooms, eq(rooms.id, id))) === 1;

    if (!doesRoomExist) {
      return status(400, {
        error: `Room "${id}" does not exist`,
        success: false,
      });
    }

    const rowCount = await db.$count(chats, eq(chats.roomId, id));
    return status(200, rowCount);
  });
