import { and, asc, desc, eq, gt, lt } from 'drizzle-orm';
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
    async function roomsRouteGetIdChats({ status, params: { id }, query: { cursor, limit } }) {
      // for querying... limit always applies, defaults to 20
      // query accepts _either_ `after` or `before`, which are the `id` of a chat
      // 400 error is returned if that `id` is not found
      // if neither is passed, latest is used
      // not support query from earliest, or custom direction
      // all returned arrays are returned in order latest to earliest
      // default limit is 20, passing 0 will give you

      if (cursor != null) {
        const doesExist =
          (await db.query.chats.findFirst({ columns: { id: true }, where: eq(chats.id, cursor) })) != null;
        if (!doesExist) {
          return status(400, 'Chat query from "before" id does not exist.');
        }
      }

      const positionClause = cursor != null ? lt(chats.id, cursor) : null;
      const eqClause = eq(chats.roomId, id);
      const whereClause = positionClause != null ? and(eqClause, positionClause) : eqClause;

      // `findMany()` is "promise-like", so we have to wrap it in an async function like this for it work properly with Result.try
      const [isRoomChatsOk, roomChatsErr, roomChats] = await Result.try(async () => {
        const result = await db.query.chats.findMany({
          limit: limit === 0 ? undefined : (limit ?? 20),
          orderBy: [desc(chats.id)],
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
        // TODO: make these discriminating unions
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Integer({ minimum: 0 })),
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
