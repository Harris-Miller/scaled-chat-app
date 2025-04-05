import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { users } from './routes/user';

const app = new Elysia()
  .use(serverTiming())
  .use(opentelemetry())
  .use(swagger())
  .get('/', () => 'Hello Elysia')
  .use(users)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
