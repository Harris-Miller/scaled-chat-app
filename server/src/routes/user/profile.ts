import { and, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { Result } from 'try';

import { getUser } from '../../common/authService';
import { db } from '../../db';
import { profilePics } from '../../db/schema';
import { s3 } from '../../s3';

// string | null because checking for `null` key is a use-case
const supportedProfilePicContentType = new Set<string | null>(['image/png', 'image/jpg', 'image/jpeg']);

const contentTypeToExt = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
} as const;

type ContentType = keyof typeof contentTypeToExt;

export const profileRoutes = new Elysia()
  .use(getUser)
  .get('/profile', async function userRouteGetProfile({ user }) {
    const [profilePic] = await db
      .select({ id: profilePics.id })
      .from(profilePics)
      .where(and(eq(profilePics.userId, user.id), eq(profilePics.selected, true), eq(profilePics.success, true)))
      .limit(1);

    return {
      ...user,
      // ok if undefined, just means that user doesn't have a selected profilePic
      profilePicId: profilePic?.id,
    };
  })
  .get('/profile/pic/:id', async function userRouteGetProfilePicId({ set, status, params: { id: picId } }) {
    const [profilePic] = await db.select().from(profilePics).where(eq(profilePics.id, picId)).limit(1);

    if (profilePic == null) {
      return status(404, 'Not Found');
    }

    if (!profilePic.success) {
      return status(404, 'Not Found');
    }

    const { contentType } = profilePic;

    const fileName = `profilePic:${picId}.${contentTypeToExt[contentType as ContentType]}`;

    // TODO: handle error
    const fileBuffer = await s3.file(fileName).arrayBuffer();

    const fileBlob = new Blob([fileBuffer], { type: contentType });

    set.headers = { 'Content-Type': contentType };
    return status(200, fileBlob);
  })
  .get('/profile/pic/:id/thumb', async function userRouteGetProfilePicIdThumb({ set, status, params: { id: picId } }) {
    const [profilePic] = await db.select().from(profilePics).where(eq(profilePics.id, picId)).limit(1);

    if (profilePic == null) {
      return status(404, 'Not Found');
    }

    if (!profilePic.success) {
      return status(404, 'Not Found');
    }

    const { contentType } = profilePic;

    const fileName = `profilePic:${picId}:thumb.${contentTypeToExt[contentType as ContentType]}`;

    // TODO: handle error
    const fileBuffer = await s3.file(fileName).arrayBuffer();

    const fileBlob = new Blob([fileBuffer], { type: contentType });

    set.headers = { 'Content-Type': contentType };
    return status(200, fileBlob);
  })
  .post(
    '/profile/pic',
    async function userRoutePostProfilePic({ status, body, user }) {
      // ?? cannot destructure this for some reason
      // eslint-disable-next-line @typescript-eslint/prefer-destructuring
      const file = body.file;
      const contentType = file.type;

      if (!supportedProfilePicContentType.has(contentType)) {
        return status(500, 'Content-Type requested to be one of: image/png, image/jpg, image/jpeg');
      }

      const buffer = await file.arrayBuffer();

      const [insertOk, insertErr, insertResult] = await Result.try(async () => {
        const results = await db
          .insert(profilePics)
          .values({
            contentType,
            selected: false,
            // start if with unsuccessful, only marking if both profilePic and thumbnail successfully uploaded to s3
            success: false,
            userId: user.id,
          })
          .returning({ picId: profilePics.id });
        return results;
      });

      if (!insertOk) {
        return status(500, `Failed to process profile pic: "${(insertErr as Error).message}"`);
      }

      const { picId } = insertResult[0]!;

      const fileName = `profilePic:${picId}.${contentTypeToExt[contentType as ContentType]}`;
      const thumbFileName = `profilePic:${picId}:thumb.${contentTypeToExt[contentType as ContentType]}`;

      const thumbnailResp = await Bun.fetch(`${process.env.THUMBNAIL_URL}/thumbnail`, {
        body: buffer,
        headers: {
          'Content-Type': contentType,
        },
        method: 'POST',
      });

      if (!thumbnailResp.ok) {
        // fire and forget, if this fails, nothing we can do, just move on
        db.delete(profilePics).where(eq(profilePics.id, picId));
        const msg = await thumbnailResp.text();
        return status(500, `Failed to process profile pic. Failed to generate thumbnail. ${msg}`);
      }

      const [s3Ok, s3Err] = await Result.try(
        Promise.allSettled([s3.write(fileName, buffer), s3.write(thumbFileName, await thumbnailResp.arrayBuffer())]),
      );

      if (!s3Ok) {
        // fire and forget, if this fails, nothing we can do, just move on
        db.delete(profilePics).where(eq(profilePics.id, picId));
        return status(500, `Failed to process profile pic. ${(s3Err as Error).message}`);
      }

      // TODO: handle err
      await db.update(profilePics).set({ selected: true, success: true }).where(eq(profilePics.id, picId));

      return status(200, { picId });
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    },
  );
