import sharp from 'sharp';

Bun.serve({
  routes: {
    '/thumbnail': {
      async POST(req, ) {
        const contentType = req.headers.get('Content-Type');
        if (contentType !== 'image/png' && contentType !== 'image/jpg') {
          return new Response('Content-Type requested to be either image/png or image/jpg', { status: 400 });
        }

        const imageBuffer = await req.arrayBuffer();

        const thumbnailBuffer = await sharp(imageBuffer).resize(48).toBuffer()

        const blob = new Blob([thumbnailBuffer], { type: contentType });

        return new Response(blob, { status: 200, headers: {
          'Content-Type': contentType
        }});
      }
    }
  },

  fetch(_req) {
    return new Response('Not Found', { status: 404 });
  },

  port: 3000
});
