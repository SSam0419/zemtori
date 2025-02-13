"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productPricing, productPricingValues } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { CheckCanProductUpdate } from "./check-can-product-update";

export async function AddProductPricing({
  productId,
  pricingData,
}: {
  productId: string;
  pricingData: {
    price: number;
    stock: number;
    variants: {
      variantValueId: string;
    }[];
    isDefault: boolean;
  };
}) {
  try {
    const db = await getTenantDbByAdmin();

    const canBeUpdated = await CheckCanProductUpdate({ productId, db });
    if (!canBeUpdated) {
      return handleFailureReturn(Error("Product cannot be updated, it is already published"));
    }

    const drizzleClient = await getDrizzleClient(db);
    const id = getUUID();

    await drizzleClient.insert(productPricing).values({
      id: id,
      productId: productId,
      price: pricingData.price,
      stock: pricingData.stock,
      isDefault: pricingData.isDefault,
      isArchived: true,
    });

    for (const variant of pricingData.variants) {
      await drizzleClient.insert(productPricingValues).values({
        productPricingId: id,
        variantValueId: variant.variantValueId,
      });
    }

    return handleSuccessReturn({ success: true });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
