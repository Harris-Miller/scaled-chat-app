import { createClient } from 'redis';

let instance: Awaited<ReturnType<typeof createClient>> | undefined;

export const createRedisInstance = async () => {
  instance = await createClient({
    url: process.env.REDIS_URL,
  })
    .on('connect', () => {
      console.log('Redis Client connecting');
    })
    .on('ready', () => {
      console.log('Redis Client ready');
    })
    .on('error', (err: unknown) => {
      console.log('Redis Client Error', err);
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
