import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

export const logger = createLogger({
  format: format.json(),
  level: 'silly',
  transports: [
    new transports.Console(), // Optional: log to console as well
    // new transports.File({ filename: 'combined.log' }),
    new LokiTransport({
      host: process.env.LOKI_URL,
      json: true,
      labels: { app: 'chat-server' },
    }),
  ],
});
