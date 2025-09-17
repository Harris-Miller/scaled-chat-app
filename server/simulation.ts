/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { io } from 'socket.io-client';

import { db } from './src/db';
import { rooms, users } from './src/db/schema';
import { randomChatGptGeneratedPhrases } from './src/db/seedData';

console.log('running simulation');
console.log('fetching user data');

const userIds = await db
  .select({ id: users.id })
  .from(users)
  .then(us => us.map(u => u.id));
const roomIds = await db
  .select({ id: rooms.id })
  .from(rooms)
  .then(rs => rs.map(r => r.id));

const numPhrases = randomChatGptGeneratedPhrases.length;
const numUsers = userIds.length;
const numRooms = roomIds.length;

console.log(`${numUsers} users found. ${numRooms} rooms found.`);

const coloradoRoomId = '9Q5yMi8VkkZZCoZeevEQZ';

const createSocket = (i: number) => {
  // const fakeLocalIp = `127.0.0.${i}`;
  // const transport = net.connect({
  //   host: '127.0.0.1',
  //   localAddress: fakeLocalIp,
  //   port: 80,
  // });

  const socket = io(`http://nginx`, {
    autoConnect: false,
    // extraHeaders: {
    //   'x-forwarded-for': `172.18.0.9${i}`,
    // },
    path: '/api/ws/',
    // transportOptions: {
    //   websocket: { createConnection: () => transport },
    // },
  });

  socket.on('connect', () => {
    console.log('socket.IO connected');

    const text = randomChatGptGeneratedPhrases[Math.floor(Math.random() * numPhrases)];
    const userId = userIds[Math.floor(Math.random() * numUsers)];

    socket.emit('chat:text', { roomId: coloradoRoomId, text, userId });
  });
  socket.on('connect_error', error => {
    console.log('socket.IO errored on connection', error.message);
  });
  socket.on('disconnect', (reason, details) => {
    console.log('socket.IO disconnected!', reason, details);
  });

  return socket;
};

// const sockets = Array(1)
//   .fill(undefined)
//   .map((_, i) => {
//     const socket = createSocket(i);
//     socket.connect();
//     return socket;
//   });

const postChat = async () => {
  const text = randomChatGptGeneratedPhrases[Math.floor(Math.random() * numPhrases)];
  const userId = userIds[Math.floor(Math.random() * numUsers)];
  // const roomId = '9Q5yMi8VkkZZCoZeevEQZ'; // colorado
  const roomId = roomIds[Math.floor(Math.random() * numRooms)];

  const ipSuffix = Math.floor(Math.random() * 9);

  try {
    await Bun.fetch(`http://localhost/api/rooms/${roomId}/chats`, {
      body: JSON.stringify({ text }),
      headers: { Accept: '*/*', Authorization: `Bearer ${userId}`, 'Content-Type': 'application/json' },
      method: 'POST',
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    }).then(r => (r.ok ? r : Promise.reject(r)));
    console.log('chat sent.');
  } catch (e) {
    console.log('chat failed.', e);
  }
};

// postChat();

const delayBetweenPosts = 200;
console.log(`Sending every ${delayBetweenPosts}ms...`);
setInterval(postChat, delayBetweenPosts);
