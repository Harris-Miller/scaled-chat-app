import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { getUser } from '../../common/authService';
import { db } from '../../db';
import { canvas } from '../../db/schema';

/**
 * If a canvas doesn't yet exist for a room, create one
 */
const getOrCreateCanvas = async (roomId: string) => {
  const canvasForRoom = await db.query.canvas.findFirst({ where: eq(canvas.roomId, roomId) });

  if (canvasForRoom != null) return canvasForRoom;

  const [newCanvasForRoom] = await db.insert(canvas).values({ roomId, text: '' }).returning();
  return newCanvasForRoom!;
};

export const canvasRoutes = new Elysia()
  .use(getUser)
  .get('/:id/canvas', async function roomsRouteGetIdCanvas({ status, params: { id } }) {
    const canvasForRoom = await getOrCreateCanvas(id);
    return status(200, canvasForRoom);
  })
  .post('/:id/canvas', function roomsRoutePostIdCanvas({ status }) {
    return status(500, 'Not yet implemented');
  });
