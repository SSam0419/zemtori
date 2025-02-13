"use server";
import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productPricing } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { CheckCanProductUpdate } from "./check-can-product-update";

export async function ArchiveProductPricing({ productPricingId }: { productPricingId: string }) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const productIdQuery = await drizzleClient.query.productPricing.findFirst({
      columns: {
        productId: true,
        isDefault: true,
      },
      where: (price, { eq }) => {
        return eq(price.id, productPricingId);
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
    const result = await drizzleClient
      .update(productPricing)
      .set({
        isArchived: true,
      })
      .where(eq(productPricing.id, productPricingId))
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}

export async function ActivateProductPricing({ productPricingId }: { productPricingId: string }) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const productIdQuery = await drizzleClient.query.productPricing.findFirst({
      columns: {
        productId: true,
        isDefault: true,
      },
      where: (price, { eq }) => {
        return eq(price.id, productPricingId);
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
    const result = await drizzleClient
      .update(productPricing)
      .set({
        isArchived: false,
      })
      .where(eq(productPricing.id, productPricingId))
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
