import { cors } from '@elysiajs/cors';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Server as SocketIoBunEngine } from '@socket.io/bun-engine';
import { Elysia } from 'elysia';
import { Server as SocketIoServer } from 'socket.io';

// import { seedDb } from './db';
import { createRedisInstance } from './redis/redisClient';
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

// await seedDb();

await createRedisInstance();

const io = new SocketIoServer();
const engine = new SocketIoBunEngine();

io.bind(engine);

// const handlePing = () => {}

io.on('connection', socket => {
  console.log('socket.io connected!');
  socket.on('ping', () => {
    console.log('received ping, responding...');
    socket.emit('pong', 'hello from server!');
  });
});

const { websocket } = engine.handler();

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
  .use(api);

const serverInstance = Bun.serve({
  fetch(req, server) {
    const url = new URL(req.url);

    console.log(url.toString());

    if (url.pathname === '/ws/') {
      return engine.handleRequest(req, server);
    }
    return app.fetch(req);
  },
  port: process.env.PORT,
  websocket,
});

console.log(`🦊 Elysia is running at at ${serverInstance.hostname}:${serverInstance.port}`);
