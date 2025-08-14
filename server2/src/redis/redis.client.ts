import { Effect } from 'effect';
import { createClient } from 'redis';

export class Redis extends Effect.Service<Redis>()('app/redis', {
  effect: Effect.gen(function* () {
    const instance = yield* Effect.promise(() =>
      createClient({
        // TODO: get url/port from process.env
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
        .connect(),
    );

    return {
      set: (...args: Parameters<typeof instance.set>) => Effect.promise(() => instance.set(...args)),
    };
  }),
}) {}

// const redisLive = Layer.effect(
//   RedisClient,
//   Effect.gen(function* () {

//     return {
//       get: () => Effect.succeed(42)
//     };
//   }),
// );

// Define the configuration for Redis
// export interface redisConfig {
//   readonly host: string;
//   readonly port: number;
// }

// export const redisConfig = Config.struct({
//   host: Config.string('REDIS_HOST'),
//   port: Config.number('REDIS_PORT'),
// });

// // Create a Layer that provides the RedisClient
// export const RedisClientLive = Layer.scoped(
//   RedisClient,
//   Effect.gen(function* () {
//     const config = yield* redisConfig;
//     const client = new IORedis({ host: config.host, port: config.port });

//     // Ensure the client is closed when the scope exits
//     yield* Scope.addFinalizer(() =>
//       Effect.promise(() => client.quit()).pipe(
//         Effect.tapError(Console.error),
//         Effect.catchAll(() => Effect.void), // Ignore errors during quit
//       ),
//     );

//     yield* Effect.promise(() => client.ping()).pipe(
//       Effect.tap(() => Console.log('Redis client connected successfully.')),
//       Effect.tapError(error => Console.error('Failed to connect to Redis:', error)),
//     );

//     return client;
//   }),
// );
