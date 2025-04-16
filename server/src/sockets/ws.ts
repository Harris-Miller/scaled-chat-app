import { Elysia } from 'elysia';

export const webSocket = new Elysia({ prefix: '/ws' }).ws('/ping', {
  message(ws, payload) {
    console.log('/ping message');

    // echo
    ws.send({
      message: `Echo: ${payload as string}`,
      time: Date.now(),
    });
  },
  open(ws) {
    console.log('/ping open');
    console.log(JSON.stringify(ws, null, 2));
    ws.send({
      message: 'you are now connected',
      time: Date.now(),
    });
  },
});
