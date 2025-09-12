import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { Result } from 'try';

import { getUser } from '../common/authService';
import { db } from '../db';
import { chats, rooms } from '../db/schema';

export const roomsRoute = new Elysia({ prefix: '/rooms' })
  .use(getUser)
  .get('/', async () => {
    const results = await db.select().from(rooms);
    return results;
  })
  .post(
    '/',
    async ({ body: { name }, status, user }) => {
      const roomWithNameExists = (await db.$count(rooms, eq(rooms.name, name))) !== 0;
      if (roomWithNameExists) {
        return status(409, {
          message: 'Room names must be unique',
          success: false,
        });
      }

      // TODO: wrap in tryCatch or `try` package
      const newRoom = await db
        .insert(rooms)
        .values({
          adminId: user.id,
          name,
        })
        .returning()
        .then(r => r[0]);

      if (newRoom == null) {
        return status(422, {
          message: 'unknown error during room creation process',
          success: false,
        });
      }

      return status(201, newRoom);
    },
    {
      body: t.Object({
        name: t.String({ error: 'Invalid room name', maxLength: 255, minLength: 3 }),
      }),
    },
  )
  .get(
    '/:id',
    async ({ status, params: { id } }) => {
      const results = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);

      const [room] = results;

      if (room == null) {
        return status(404, {
          message: 'Room not found.',
          success: false,
        });
      }

      return room;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get('/:id/chats', async ({ status, params: { id } }) => {
    const [isRoomChatsOk, roomChatsErr, roomChats] = await Result.try(async () => {
      const result = await db.select().from(chats).where(eq(chats.roomId, id));
      return result;
    });

    if (!isRoomChatsOk) {
      return status(500, {
        error: (roomChatsErr as Error).message,
        success: false,
      });
    }

    console.log(roomChats);

    return status(200, roomChats);
  })
  .post(
    '/:id/chats',
    async ({ status, body: { text }, params: { id }, user }) => {
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

      return status(201, newChat);
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    },
  );
