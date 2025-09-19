import { sql } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { db } from '../db';
import { getRedisStatus } from '../redis/redisClient';

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

export const kubeProbes = new Elysia({ prefix: '/health' })
  .get('/ready', async ({ status }) => {
    const isRedisReady = getRedisStatus() === 'ready';
    // Add your readiness logic here. For example, check if the database is connected.
    const isDatabaseReady = await checkDbConnection();

    if (isDatabaseReady && isRedisReady) {
      return status(200);
    }

    return status(500);
  })
  .get('/live', ({ status }) => {
    // Note: don't check db/redis status here, that's not what this is for
    // this is to see if _this_ app has crashed or not for k8s to know to relaunch it, etc
    // that shouldn't happen if this app hasn't gone done but db/redis, or it's connections, has
    // so we _do not_ check for that like we do for `ready` above
    return status(200);
  });
