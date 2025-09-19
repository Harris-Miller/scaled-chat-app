import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
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
      staticLabels: { service: 'thumbnail-micro' },
    }),
  )
  .use(
    elysiaLogging(logger, {
      format: 'json',
      level: 'verbose',
    }),
  )
  .use(
    opentelemetry({
      serviceName: 'thumbnail-micro',
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({ url: process.env.OTLP_TRACES_URL }),
        ),
      ],
    }),
  );
