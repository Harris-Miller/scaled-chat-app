import { Elysia, t } from 'elysia';

export const webSocket = new Elysia({ prefix: '/ws' }).ws('/ping', {
  // validate incoming message
  // body: t.Object({
  //   message: t.String(),
  // }),
  message(ws, payload) {
    console.log('/ping message');

    // echo
    ws.send({
      message: payload,
      time: Date.now(),
    });
  },
  open(ws) {
    console.log('/ping open');
    ws.send({
      message: 'you are now connected',
      time: Date.now(),
    });
  },
});
