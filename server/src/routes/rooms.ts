import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { getUser } from '../common/authService';
import { db } from '../db';
import { rooms } from '../db/schema';

export const roomsRoute = new Elysia({ prefix: '/rooms' })
  .use(getUser)
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
        .returning({ description: rooms.description, id: rooms.id, name: rooms.name })
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
        id: t.Integer({
          error: 'Invalid roomId. Must be an integer',
        }),
      }),
    },
  );
