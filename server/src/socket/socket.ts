import { Server as SocketIoBunEngine } from '@socket.io/bun-engine';
// import { createAdapter } from '@socket.io/redis-adapter';
import { Server as SocketIoServer } from 'socket.io';

import { db } from '../db';
import { chats } from '../db/schema';
import { createRedisInstance, getRedisClient, getRedisSubClient } from '../redis/redisClient';

await createRedisInstance();
const redisClient = getRedisClient();
const subClient = getRedisSubClient();

const io = new SocketIoServer({
  // adapter: createAdapter(redisClient, subClient),
});
const engine = new SocketIoBunEngine();

io.bind(engine);

io.on('connection', socket => {
  console.log('socket.io connected!');

  socket.on('ping', () => {
    console.log('received ping, responding...');
    socket.emit('pong', 'hello from server!');
  });

  // TODO: abstract these into files
  socket.on('room:join', (args: { roomId: string }) => {
    console.log('room:join', args);
    socket.join(`room:${args.roomId}`);
  });

  socket.on('room:leave', (args: { roomId: string }) => {
    console.log('room:leave', args);
    socket.leave(`room:${args.roomId}`);
  });

  socket.on('chat:text', async (args: { id: string; roomId: string; text: string; userId: string }) => {
    console.log('chat:text', args);
    const { id, roomId, userId: authorId, text } = args;

    // TODO: try/catch
    const [newChat] = await db.insert(chats).values({ authorId, id, roomId, text }).returning();

    socket.broadcast.to(`room:${args.roomId}`).emit('chat', newChat!);
  });
});

const { websocket } = engine.handler();

export { engine, websocket };
