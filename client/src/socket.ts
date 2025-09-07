import { io } from 'socket.io-client';

const socket = io({
  autoConnect: true,
  path: '/ws/',
});

socket.on('connect', () => {
  console.log('socket.IO connected');
});
socket.on('connect_error', error => {
  console.log('socket.IO errored on connection', error.message);
});
socket.on('disconnect', (reason, details) => {
  console.log('socket.IO disconnected!', reason, details);
});

export { socket };
