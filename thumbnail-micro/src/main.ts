import sharp from 'sharp';

const acceptableContentTypes = ['image/png', 'image/jpg', 'image/jpeg'] as const;

type ContentType = (typeof acceptableContentTypes)[number];

const supportedProfilePicContentType = new Set<string | null>(acceptableContentTypes);

const isSupportedContentType = (contentType: string | null ): contentType is ContentType => supportedProfilePicContentType.has(contentType)

Bun.serve({
  routes: {
    '/thumbnail': {
      async POST(req, ) {
        console.log('POST /thumbnail');
        const contentType = req.headers.get('Content-Type');
        if (!isSupportedContentType(contentType)) {
          console.log('400 :: Content-Type requested to be either image/png or image/jpg');
          return new Response('Content-Type requested to be one of: image/png, image/jpg, image/jpeg', { status: 400 });
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
