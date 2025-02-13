"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetProductImages({ productId }: { productId: string }) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.productImages.findMany({
      where: (productImages, { eq }) => {
        return eq(productImages.productId, productId);
      },
    });
    return handleSuccessReturn(
      result.map((productImage) => ({
        imageId: productImage.id,
        imageUrl: productImage.url,
      })),
    );
  } catch (error) {
    console.error("GetProductImages error:", error);
    return handleFailureReturn(error);
  }
}
