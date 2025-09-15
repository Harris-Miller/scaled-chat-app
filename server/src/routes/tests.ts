import { Elysia, t } from 'elysia';

const sieveOfEratosthenes = (n: number): number => {
  // Create a boolean array "isPrime[0..n]" and initialize
  // all entries it as true. A value in isPrime[i] will
  // finally be false if i is Not a prime, else true.
  const isPrime = new Array(n + 1).fill(true) as boolean[];

  // 0 and 1 are not prime numbers
  isPrime[0] = false;
  isPrime[1] = false;

  // Start checking from 2 up to the square root of n
  for (let p = 2; p * p <= n; p += 1) {
    // If isPrime[p] is still true, then it is a prime
    if (isPrime[p] === true) {
      // Mark all multiples of p as not prime
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }

  // Collect all prime numbers
  // const primes = [];
  // for (let i = 2; i <= n; i++) {
  //   if (isPrime[i]) {
  //     primes.push(i);
  //   }
  // }

  // find highest prime
  let highestPrime = 0;
  for (let i = 2; i <= n; i += 1) {
    if (isPrime[i] === true) {
      highestPrime = i;
    }
  }

  return highestPrime;
};

// this route is here to test mem usage and processing
export const testsRoute = new Elysia({ prefix: '/test' })
  .get(
    '/primes/:to',
    ({ status, params }) => {
      const highestPrime = sieveOfEratosthenes(params.to);
      return status(200, { highestPrime });
    },
    {
      params: t.Object({
        to: t.Integer({ minimum: 1 }),
      }),
    },
  )
  .get(
    '/file/:type/:size',
    async ({ set, status, params }) => {
      const type = params.type ?? 'txt';
      const size = params.size ?? 100;

      const response = await fetch(`http://fakeapis:3000/file/${type}/${size}`);
      // I'm specifically not doing r.text() here because this endpoint is to measure memory usage
      const blob = await response.blob();

      await Bun.sleep(2000);

      const asText = blob.text();

      await Bun.sleep(2000);

      set.headers = {
        'Content-Disposition': response.headers.get('Content-Disposition')!,
        'Content-Type': response.headers.get('Content-Type')!,
      };

      return status(200, asText);
    },
    {
      params: t.Object({
        size: t.Optional(t.Integer({ maximum: 2048, minimum: 1 })),
        type: t.Optional(t.UnionEnum(['txt', 'json', 'xml', 'jpg', 'png'])),
      }),
    },
  );
