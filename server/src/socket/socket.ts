import { Server as SocketIoBunEngine } from '@socket.io/bun-engine';
import { Server as SocketIoServer } from 'socket.io';

const io = new SocketIoServer();
const engine = new SocketIoBunEngine();

io.bind(engine);

io.on('connection', socket => {
  console.log('socket.io connected!');

  socket.on('ping', () => {
    console.log('received ping, responding...');
    socket.emit('pong', 'hello from server!');
  });

  // TODO: abstract these into files
  socket.on('room:join', (args: { roomId: number }) => {
    console.log('room:join', args);
    socket.join(`room:${args.roomId}`);

    globalThis.setTimeout(() => {
      io.to(`room:${args.roomId}`).emit('chat', { text: 'first', timestamp: new Date(), userId: 0 });
    }, 500);
    globalThis.setTimeout(() => {
      io.to(`room:${args.roomId}`).emit('chat', { text: 'second', timestamp: new Date(), userId: 0 });
    }, 2000);
    globalThis.setTimeout(() => {
      io.to(`room:${args.roomId}`).emit('chat', { text: 'third', timestamp: new Date(), userId: 0 });
    }, 5000);
  });

  socket.on('room:leave', (args: { roomId: number }) => {
    console.log('room:leave', args);
    socket.leave(`room:${args.roomId}`);
  });
});

const { websocket } = engine.handler();

export { engine, websocket };
