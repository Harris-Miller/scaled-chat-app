/* eslint-disable import/unambiguous */
declare module 'bun' {
  interface Env {
    DATABASE_URL: string;
    OTLP_TRACES_URL: string;
    PORT: string;
    REDIS_URL: string;
  }
}
