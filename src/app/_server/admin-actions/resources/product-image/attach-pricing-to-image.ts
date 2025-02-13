"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productPricingImages } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function AttachPricingToImage({
  imageId,
  pricingId,
}: {
  imageId: string;
  pricingId: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const result = await drizzleClient
      .insert(productPricingImages)
      .values({
        productImageId: imageId,
        productPricingId: pricingId,
      })
      .returning();

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
