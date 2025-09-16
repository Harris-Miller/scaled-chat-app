import { S3Client } from 'bun';

export const s3 = new S3Client({
  accessKeyId: 'minioadmin',
  bucket: 'my-bucket',
  endpoint: process.env.S3_URL,
  secretAccessKey: 'minioadmin',
});
