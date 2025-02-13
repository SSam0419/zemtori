"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productImages } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { UploadImage } from "../file-upload/upload-file-r2";

export async function CreateProductImage({
  imageFile,
  productId,
}: {
  imageFile: File;
  productId: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const imageUrl = await UploadImage(imageFile);
    const drizzleClient = await getDrizzleClient(db);
    await drizzleClient.insert(productImages).values({
      id: getUUID(),
      productId: productId,
      url: imageUrl.fileUrl,
    });

    return handleSuccessReturn({
      imageUrl: imageUrl.fileUrl,
    });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
