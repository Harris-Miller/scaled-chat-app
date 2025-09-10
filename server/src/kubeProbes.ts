import { sql } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { db } from './db';
import { getRedisStatus } from './redis/redisClient';

/**
 * A minimal query to check the database connection
 * 'select 1' is a standard, lightweight way to test connectivity
 */
const checkDbConnection = async () => {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch (_e) {
    return false;
  }
};

export const kubeProbes = new Elysia()
  .get('/readyz', async ({ status }) => {
    const isRedisReady = getRedisStatus() === 'ready';
    // Add your readiness logic here. For example, check if the database is connected.
    const isDatabaseReady = await checkDbConnection();

    if (isDatabaseReady && isRedisReady) {
      return status(200);
    }

    return status(500);
  })
  .get('/healthz', ({ status }) => {
    return status(200);
  });
