import { Server as SocketIoBunEngine } from '@socket.io/bun-engine';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server as SocketIoServer } from 'socket.io';

import { db } from '../db';
import { chats } from '../db/schema';
import { logger } from '../logger';
import { createRedisInstance, getRedisClient, getRedisSubClient } from '../redis/redisClient';

await createRedisInstance();
const redisClient = getRedisClient();
const redisSubClient = getRedisSubClient();

const io = new SocketIoServer({
  adapter: createAdapter(redisClient, redisSubClient),
});

const engine = new SocketIoBunEngine();

io.bind(engine);

io.on('connection', socket => {
  logger.info('socket.io connected!');

  socket.on('ping', () => {
    logger.silly('received ping, responding...');
    socket.emit('pong', 'hello from server!');
  });

  // TODO: abstract these into files
  socket.on('room:join', (args: { roomId: string }) => {
    logger.silly('room:join', args);
    socket.join(`room:${args.roomId}`);
  });

  socket.on('room:leave', (args: { roomId: string }) => {
    logger.silly('room:leave', args);
    socket.leave(`room:${args.roomId}`);
  });

  socket.on('chat:text', async (args: { roomId: string; text: string; userId: string }) => {
    logger.silly('chat:text', args);
    const { roomId, userId: authorId, text } = args;

    // TODO: try/catch
    const [newChat] = await db.insert(chats).values({ authorId, roomId, text }).returning();

    if (newChat != null) {
      // uncomment to test redis load
      // fire and forget
      // getRedisClient().set(`room:${roomId}:chat:${newChat.id}`, JSON.stringify(newChat));
    }

    io.to(`room:${args.roomId}`).emit('chat', newChat!);
  });
});

const { websocket } = engine.handler();

export { engine, websocket, io };
