import { Server as SocketIoBunEngine } from '@socket.io/bun-engine';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server as SocketIoServer } from 'socket.io';

import { db } from '../db';
import { chats } from '../db/schema';
import { createRedisInstance, getRedisClient, getRedisSubClient } from '../redis/redisClient';

console.log('awaiting redisInstance');
await createRedisInstance();
const redisClient = getRedisClient();
const redisSubClient = getRedisSubClient();
console.log('redis instance retrieved');

console.log('awaiting socketIO server with redis-streams-adapter');
const io = new SocketIoServer({
  adapter: createAdapter(redisClient, redisSubClient),
});
console.log('socketIO server created');
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

  socket.on('chat:text', async (args: { roomId: string; text: string; userId: string }) => {
    console.log('chat:text', args);
    const { roomId, userId: authorId, text } = args;

    // TODO: try/catch
    const [newChat] = await db.insert(chats).values({ authorId, roomId, text }).returning();

    io.to(`room:${args.roomId}`).emit('chat', newChat!);
  });
});

const { websocket } = engine.handler();

export { engine, websocket, io };
