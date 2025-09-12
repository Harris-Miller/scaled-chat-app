Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    '/health': new Response('Ok'),

    '/text': new Response('This is the response from the GET /text endpoint'),

    '/json': {
      GET: () => Response.json({ data: 'This is the response from the GET /json endpoint' }),
      POST: async req => {
        const body = (await req.json()) as object;
        return Response.json({ data: 'This is the response from the POST /json endpoint', ...body });
      },
    },
  },

  // (optional) fallback for unmatched routes:
  // Required if Bun's version < 1.2.3
  fetch(req) {
    return new Response('Not Found', { status: 404 });
  },
  port: 3000,
});
