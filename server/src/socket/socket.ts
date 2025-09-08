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
  });

  socket.on('room:leave', (args: { roomId: number }) => {
    console.log('room:leave', args);
    socket.leave(`room:${args.roomId}`);
  });

  socket.on('chat:text', (args: { roomId: number; text: string; userId: number }) => {
    console.log('chat:text', args);
    socket.broadcast
      .to(`room:${args.roomId}`)
      .emit('chat', { text: args.text, timestamp: new Date(), userId: args.userId });
  });
});

const { websocket } = engine.handler();

export { engine, websocket };
