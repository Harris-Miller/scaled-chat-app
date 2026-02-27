import { S3Client } from 'bun';

export const s3 = new S3Client({
  accessKeyId: 'minioadmin',
  bucket: 'profile-pics',
  endpoint: process.env.S3_URL,
  secretAccessKey: 'minioadmin',
});
