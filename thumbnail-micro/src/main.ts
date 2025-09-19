import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import sharp from 'sharp';
import { otel } from './otel';
import { logger } from './logger';

const acceptableContentTypes = ['image/png', 'image/jpg', 'image/jpeg'] as const;

type ContentType = (typeof acceptableContentTypes)[number];

const supportedProfilePicContentType = new Set<string | undefined>(acceptableContentTypes);

const isSupportedContentType = (contentType: string | undefined): contentType is ContentType => supportedProfilePicContentType.has(contentType)

new Elysia()
  .use(otel)
  .onError(({ error }) => {
    logger.error(error);
    return error;
  })
  .use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['OPTION', 'GET', 'POST', 'PUT', 'DELETE'],
      origin: '*', // origin: /localhost/, // TODO set this up for production
      preflight: true,
    }),
  )
  .get('/ping', ({ status }) => status(200, 'pong'))
  .post('/thumbnail', async ({ status, headers, request, set }) => {
    const contentType = headers['Content-Type'] ?? headers['content-type'];

    if (!isSupportedContentType(contentType)) {
      console.log('400 :: Content-Type requested to be one of: image/png, image/jpg, image/jpeg');
      return status(400, 'Content-Type requested to be one of: image/png, image/jpg, image/jpeg')
    }

    const imageBuffer = await request.arrayBuffer();
    const thumbnailBuffer = await sharp(imageBuffer).resize(48).toBuffer()
    const blob = new Blob([thumbnailBuffer], { type: contentType });

    set.headers = { 'Content-Type': contentType };
    return status(200, blob);
  }, { parse: 'none' })
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') {
      return 'Not Found'
    }
  })
  .listen(3008);
