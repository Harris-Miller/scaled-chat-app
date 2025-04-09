import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { createClient } from 'redis';

import { userRoute } from './routes/user';

const client = await createClient({
  url: 'redis://localhost:6379',
})
  .on('connect', () => {
    console.log('Redis Client connecting');
  })
  .on('ready', () => {
    console.log('Redis Client ready');
  })
  .on('error', (err: unknown) => {
    console.log('Redis Client Error', err);
  })
  .connect();

const app = new Elysia()
  .use(
    cors({
      origin: /localhost/,
    }),
  )
  .use(serverTiming())
  .use(opentelemetry())
  .use(swagger())
  .get('/', () => 'Hello Elysia')
  .use(userRoute)
  .onStart(({ server }) => {
    console.log(`🦊 Elysia is running at at ${server?.hostname}:${server?.port}`);
  })
  .listen(3000);
