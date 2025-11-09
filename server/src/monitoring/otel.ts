import { opentelemetry } from '@elysiajs/opentelemetry';
import { serverTiming } from '@elysiajs/server-timing';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
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
      staticLabels: { service: 'chat-server' },
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
      instrumentations: [...getNodeAutoInstrumentations(), new FetchInstrumentation()],
      serviceName: 'chat-server',
      spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: process.env.OTLP_TRACES_URL }))],
    }),
  );
