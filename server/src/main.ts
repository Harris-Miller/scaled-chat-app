import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';

import { kubeProbes } from './monitoring/kubeProbes';
import { logger } from './monitoring/logger';
import { otel } from './monitoring/otel';
import { roomsRoute } from './routes/rooms';
import { testsRoute } from './routes/tests';
import { userRoute } from './routes/user';
import { s3 } from './s3';
import { engine, websocket } from './socket';

// Call an S3 API using the LocalStack endpoint
const didPass = !(await s3.exists('non-existent-file.jpg'));
if (didPass) {
  logger.info(`s3 connection test passed.`);
} else {
  logger.error(`s3 connection test failed!`);
}

const api = new Elysia()
  .onError(({ error }) => {
    logger.error(error);
    return error;
  })
  .get('/', () => 'Hello Elysia')
  .use(kubeProbes)
  .use(testsRoute)
  .use(userRoute)
  .use(roomsRoute);

const app = new Elysia()
  .use(otel)
  .use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['OPTION', 'GET', 'POST', 'PUT', 'DELETE'],
      origin: '*', // origin: /localhost/, // TODO set this up for production
      preflight: true,
    }),
  )
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
