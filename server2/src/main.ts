import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
  HttpMiddleware,
} from '@effect/platform';
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Clock, Console, Effect, Layer, Schema } from 'effect';

import { createServer } from 'node:http';

import { Redis } from './redis/redis.client.js';

const PORT = Number(process.env.PORT ?? '3000');

// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const myApi = HttpApi.make('MyApi').add(
  HttpApiGroup.make('Greetings').add(HttpApiEndpoint.get('hello-world')`/`.addSuccess(Schema.String)),
);

// Implement the "Greetings" group
const greetingsLive = HttpApiBuilder.group(myApi, 'Greetings', handlers =>
  handlers.handle('hello-world', () =>
    Effect.gen(function* () {
      const redis = yield* Redis;
      const now = yield* Clock.currentTimeMillis;
      const date = new Date(now);
      const message = `hello-world received at ${now}`;

      yield* Console.log('setting into redis');
      yield* redis.set(`${now}`, message);
      yield* Console.log('finished setting into redis');

      yield* Console.log(message);

      return `Hello, World! Time is ${date.toDateString()}`;
    }),
  ),
).pipe(Layer.provide(Redis.Default));

// Provide the implementation for the API
const myApiLive = HttpApiBuilder.api(myApi).pipe(Layer.provide(greetingsLive));

// Set up the server using NodeHttpServer on port 3000
const serverLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(myApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: PORT })),
);

// Launch the server
Layer.launch(serverLive).pipe(NodeRuntime.runMain);
