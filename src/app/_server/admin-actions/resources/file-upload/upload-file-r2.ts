"use server";

import { getUUID } from "@/app/_server/utils/get-uuid";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error("Missing Cloudflare credentials");
}

const config: S3ClientConfig = {
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
};

const S3 = new S3Client(config);
const BUCKET_NAME = "development";

export async function UploadImage(file: File) {
  try {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const uniqueKey = getUUID();

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer,
      ContentType: file.type, // Add content type for proper file handling
    });

    await S3.send(command);
    const fileUrl = `https://pub-414f0fe3f81f4c65aaed9132e8856e58.r2.dev/${uniqueKey}`;
    return { fileUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
