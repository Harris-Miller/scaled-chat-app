import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
// import { ElysiaLogging as elysiaLogging } from '@otherguy/elysia-logging';
import { Elysia } from 'elysia';
import prometheusPlugin from 'elysia-prometheus';

// import { seedDb } from './db';
import { kubeProbes } from './kubeProbes';
import { logger } from './logger';
import { roomsRoute } from './routes/rooms';
import { userRoute } from './routes/user';
// import { s3 } from './s3';
import { engine, websocket } from './socket';

// await seedDb();

// Call an S3 API using the LocalStack endpoint
// console.log('s3 connection test (should display false)', await s3.exists('non-existent-file.jpg'));

const api = new Elysia()
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
    prometheusPlugin({
      dynamicLabels: {
        userAgent: ctx => ctx.request.headers.get('user-agent') ?? 'unknown',
      },
      staticLabels: { service: 'chat-server' },
    }),
  )
  // .use(
  //   elysiaLogging(logger, {
  //     format: 'json',
  //     level: 'http',
  //   }),
  // )
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

logger.info(`🦊 Elysia is running at at ${serverInstance.hostname}:${serverInstance.port}`);
