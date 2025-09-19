import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
// import { ElysiaLogging as elysiaLogging } from '@otherguy/elysia-logging';
import { Elysia } from 'elysia';

import { kubeProbes } from './kubeProbes';
import { logger } from './logger';
import { otel } from './otel';
import { roomsRoute } from './routes/rooms';
import { testsRoute } from './routes/tests';
import { userRoute } from './routes/user';
import { s3 } from './s3';
import { engine, websocket } from './socket';

// Call an S3 API using the LocalStack endpoint
// eslint-disable-next-line no-console
console.log('s3 connection test (should display false)', await s3.exists('non-existent-file.jpg'));

const api = new Elysia()
  .onError(({ error }) => {
    // eslint-disable-next-line no-console
    console.log(error);
    logger.error(error);
    return error;
  })
  .get('/', () => 'Hello Elysia')
  .use(kubeProbes)
  .use(testsRoute)
  .use(userRoute)
  .use(roomsRoute);

const app = new Elysia()
  .use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['OPTION', 'GET', 'POST', 'PUT', 'DELETE'],
      origin: '*', // origin: /localhost/, // TODO set this up for production
      preflight: true,
    }),
  )
  .use(otel)
  .use(openapi())
  .use(api);

const serverInstance = Bun.serve({
  fetch(req, server) {
    // Any request on the `/ws/` path, let the socket-io engine handle
    const url = new URL(req.url);
    if (url.pathname === '/ws/') {
      // TODO: place websocket behind auth barriers
      return engine.handleRequest(req, server);
    }
    // else, send to Elysia to handle
    return app.fetch(req);
  },
  port: process.env.PORT,
  websocket,
});

logger.info(`🦊 Elysia is running at at ${serverInstance.hostname}:${serverInstance.port}`);
