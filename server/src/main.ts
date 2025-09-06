import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Elysia } from 'elysia';

// import { seedDb } from './db';
import { createRedisInstance } from './redis/redisClient';
import { campaignsRoute } from './routes/campaigns';
import { charactersRoute } from './routes/characters';
import { userRoute } from './routes/user';
import { webSocket } from './sockets/ws';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      REDIS_URL: string;
    }
  }
}

// await seedDb();

await createRedisInstance();

const api = new Elysia({ prefix: '/api' })
  .get('/', () => 'Hello Elysia')
  .use(userRoute)
  .use(charactersRoute)
  .use(campaignsRoute);

const app = new Elysia()
  .use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      origin: '*', // origin: /localhost/, // TODO set this up for production
      preflight: true,
    }),
  )
  .use(serverTiming())
  .use(
    opentelemetry({
      spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
    }),
  )
  .use(swagger())
  .use(webSocket)
  .use(api)
  .onStart(({ server }) => {
    console.log(`🦊 Elysia is running at at ${server?.hostname}:${server?.port}`);
  })
  .listen(process.env.PORT);
