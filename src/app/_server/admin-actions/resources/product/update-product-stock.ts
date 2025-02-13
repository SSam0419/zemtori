"use server";

import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { activities, productPricing } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { CheckCanProductUpdate } from "./check-can-product-update";

export async function UpdateProductStock({
  pricingId,
  stock,
}: {
  pricingId: string;
  stock: number;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const productIdQuery = await drizzleClient.query.productPricing.findFirst({
      with: {
        product: true,
      },
      where: (price, { eq }) => {
        return eq(price.id, pricingId);
      },
    });
    const productId = productIdQuery?.productId;

    if (!productId) {
      return handleFailureReturn({
        message: "Product pricing not found",
      });
    }
    const canBeUpdated = await CheckCanProductUpdate({ productId, db });
    if (!canBeUpdated) {
      return handleFailureReturn(Error("Product cannot be updated, it is already published"));
    }
    await drizzleClient.insert(activities).values({
      content: `Stock level changed for "${productIdQuery.product.productName}". Changed from ${productIdQuery.stock} to ${stock} units. Product price: $${productIdQuery.price}. ${productIdQuery.isDefault ? "Default Price Mode." : "This product has different variations"}`,
      type: "stock adjustment",
    });
    const result = await drizzleClient
      .update(productPricing)
      .set({
        stock: stock,
      })
      .where(eq(productPricing.id, pricingId))
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
