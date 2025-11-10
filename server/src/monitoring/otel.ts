import { serverTiming } from '@elysiajs/server-timing';
import { Elysia } from 'elysia';
import prometheusPlugin from 'elysia-prometheus';

import { ElysiaLogging as elysiaLogging } from './elysia-logging';
import { logger } from './logger';

export const otel = new Elysia()
  .use(serverTiming())
  .use(
    prometheusPlugin({
      dynamicLabels: {
        userAgent: ctx => ctx.request.headers.get('user-agent') ?? 'unknown',
      },
      staticLabels: { service: 'chat-server' },
    }),
  )
  .use(
    elysiaLogging(logger, {
      format: 'json',
      level: 'verbose',
    }),
  );
