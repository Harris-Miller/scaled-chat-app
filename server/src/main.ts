import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Elysia } from 'elysia';

// import { seedDb } from './db';
import { kubeProbes } from './kubeProbes';
import { roomsRoute } from './routes/rooms';
import { userRoute } from './routes/user';
import { engine, websocket } from './socket';

// await seedDb();

const api = new Elysia({ prefix: '/api' })
  .get('/', () => 'Hello Elysia')
  .use(kubeProbes)
  .use(userRoute)
  .use(roomsRoute);

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
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: process.env.OTLP_TRACES_URL,
          }),
        ),
      ],
    }),
  )
  .use(openapi())
  .use(api);

const serverInstance = Bun.serve({
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/ws/') {
      return engine.handleRequest(req, server);
    }
    return app.fetch(req);
  },
  port: process.env.PORT,
  websocket,
});

console.log(`🦊 Elysia is running at at ${serverInstance.hostname}:${serverInstance.port}`);
