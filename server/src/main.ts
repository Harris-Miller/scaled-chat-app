import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { createClient } from 'redis';

import { seedDb } from './db';
import { campaignsRoute } from './routes/campaigns';
import { charactersRoute } from './routes/characters';
import { userRoute } from './routes/user';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      REDIS_URL: string;
    }
  }
}

await seedDb();

// TODO: get url/port from process.env
const client = await createClient({
  url: process.env.REDIS_URL,
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

const app = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: /localhost/, // TODO set this up for production
    }),
  )
  .use(serverTiming())
  .use(opentelemetry())
  .use(swagger())
  .get('/', () => 'Hello Elysia')
  .use(userRoute)
  .use(charactersRoute)
  .use(campaignsRoute)
  .onStart(({ server }) => {
    console.log(`🦊 Elysia is running at at ${server?.hostname}:${server?.port}`);
  })
  .listen(process.env.PORT);
