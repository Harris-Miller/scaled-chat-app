import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { getUser } from '../../common/authService';
import { db } from '../../db';
import { rooms } from '../../db/schema';

import { chatRoutes } from './chats';

export const roomsRoute = new Elysia({ prefix: '/rooms' })
  .use(getUser)
  .get('/', async function roomsRouteGetIndex() {
    const results = await db.select().from(rooms);
    return results;
  })
  .post(
    '/',
    async function roomsRoutePostIndex({ body: { name }, status }) {
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
    async function roomsRouteGetId({ status, params: { id } }) {
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
  .use(chatRoutes);
