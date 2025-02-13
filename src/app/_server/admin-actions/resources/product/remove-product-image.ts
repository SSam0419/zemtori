"use server";

import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productImages } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { DeleteImage, getKeyFromUrl } from "../file-upload/delete-file-r2";

export async function RemoveProductImage({
  imageUrl,
  imageId,
}: {
  imageId: string;
  imageUrl: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const imageR2Key = await getKeyFromUrl(imageUrl);
    await DeleteImage(imageR2Key);

    await drizzleClient.delete(productImages).where(eq(productImages.id, imageId));

    return handleSuccessReturn({
      success: true,
    });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
