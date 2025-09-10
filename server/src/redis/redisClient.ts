import { createClient } from 'redis';

let instance: Awaited<ReturnType<typeof createClient>> | undefined;

let status: 'connect' | 'end' | 'error' | 'ready' | 'reconnecting' | null = null;

export const createRedisInstance = async () => {
  instance = await createClient({
    url: process.env.REDIS_URL,
  })
    .on('connect', () => {
      status = 'connect';
      console.log('Redis Client connecting');
    })
    .on('ready', () => {
      status = 'ready';
      console.log('Redis Client ready');
    })
    .on('end', () => {
      status = 'end';
      console.log('Redis Client ready');
    })
    .on('error', (err: unknown) => {
      status = 'error';
      console.log('Redis Client Error', err);
    })
    .on('reconnecting', () => {
      status = 'reconnecting';
      console.log('Redis Client ready');
    })
    .connect();
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

export const getRedisStatus = () => status;
