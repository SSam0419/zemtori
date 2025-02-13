"use server";

import { DeleteObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

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

export async function DeleteImage(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

// Helper function to extract key from URL
export async function getKeyFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1); // Remove leading slash
  } catch (error) {
    console.error("Error parsing URL:", error);
    throw new Error("Invalid URL format");
  }
}

// Usage example:
/*
// Delete by key directly
await DeleteImage("your-file-key");

// Or delete by URL
const fileUrl = "https://pub-414f0fe3f81f4c65aaed9132e8856e58.r2.dev/your-file-key";
const key = getKeyFromUrl(fileUrl);
await DeleteImage(key);
*/
