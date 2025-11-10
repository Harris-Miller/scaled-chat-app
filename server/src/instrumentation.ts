/* eslint-disable import/first */

// This is crucial for the fetch instrumentation to correctly identify the runtime.
process.release.name = 'bun';

import { opentelemetry } from '@elysiajs/opentelemetry';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';

export const instrumentation = opentelemetry({
  instrumentations: [...getNodeAutoInstrumentations(), new UndiciInstrumentation()],
  serviceName: 'chat-server',
  spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: process.env.OTLP_TRACES_URL }))],
});
