import { createClient } from 'redis';

import { logger } from '../monitoring/logger';

let instance: ReturnType<typeof createClient> | undefined;
let subClient: ReturnType<typeof createClient> | undefined;

let status: 'connect' | 'end' | 'error' | 'ready' | 'reconnecting' | null = null;

export const createRedisInstance = async () => {
  instance = createClient({
    url: process.env.REDIS_URL,
  })
    .on('connect', () => {
      status = 'connect';
      logger.info('Redis Client connecting');
    })
    .on('ready', () => {
      status = 'ready';
      logger.info('Redis Client ready');
    })
    .on('end', () => {
      status = 'end';
      logger.info('Redis Client ready');
    })
    .on('error', (err: unknown) => {
      status = 'error';
      logger.error('Redis Client Error', err);
    })
    .on('reconnecting', () => {
      status = 'reconnecting';
      logger.warn('Redis Client ready');
    });

  subClient = instance.duplicate();

  await Promise.all([instance.connect(), subClient.connect()]);
};

/**
 * Note: This function throws if createInstance() has not yet been  called and its promised resolved
 */
export const getRedisClient = () => {
  if (instance == null) {
    throw new Error(
      'Redis instance not yet instantiated. This means it is trying to be used because application bootstrapping has finished',
    );
  }
  return instance;
};

export const getRedisSubClient = () => {
  if (subClient == null) {
    throw new Error(
      'Redis subClient not yet instantiated. This means it is trying to be used because application bootstrapping has finished',
    );
  }
  return subClient;
};

export const getRedisStatus = () => status;
