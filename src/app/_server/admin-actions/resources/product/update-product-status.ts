"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { products } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";
import { getProductStatusId, TProductStatus } from "@/app/_shared/types/global-types";

export async function UpdateProductStatus({
  productId,
  status,
}: {
  productId: string;
  status: TProductStatus;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    if (status === "PUBLISHED") {
      const currentProduct = await drizzleClient.query.products.findFirst({
        with: {
          pricing: {
            where: (price, { eq }) => eq(price.isArchived, false),
          },
        },
        where: (prod, { eq }) => eq(prod.id, productId),
      });

      if (!currentProduct) return handleFailureReturn(Error("Product Not Found"));

      const isDefaultMode = !currentProduct.hasVariants;
      const currentProductPricing = currentProduct.pricing;

      const defaultCheck = currentProductPricing.filter((p) => p.isDefault);
      const variantsCheck = currentProductPricing.filter((p) => !p.isDefault);

      if (isDefaultMode) {
        if (defaultCheck.length === 0)
          return handleFailureReturn(new Error("You must have one active default pricing"));
        if (defaultCheck.length > 1)
          return handleFailureReturn(new Error("You can only have one active default pricing"));
      } else {
        if (variantsCheck.length === 0)
          return handleFailureReturn(new Error("You must have one active default pricing"));
      }
    }

    const result = await drizzleClient
      .update(products)
      .set({
        productStatusId: getProductStatusId(status),
      })
      .where(eq(products.id, productId))
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  } finally {
    revalidatePath(`/workspace/[shopId]/products/edit/[productId]`);
  }
}
