"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { productPricing, productPricingValues } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { ValidationError } from "@/app/_server/utils/errors";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function CreateVariantPricing({
  price,
  stock,
  variants,
  productId,
}: {
  price: number;
  stock: number;
  variants: {
    variantValueId: string;
  }[];
  productId: string;
}) {
  try {
    // Ensure that variants are provided
    if (variants.length === 0) {
      throw new ValidationError("No variants provided for variant pricing");
    }

    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const [{ id: productPricingId }] = await drizzleClient
      .insert(productPricing)
      .values({
        id: getUUID(),
        productId,
        price,
        stock,
      })
      .returning({ id: productPricing.id });

    await drizzleClient.transaction(async (tx) => {
      for (const variant of variants) {
        await tx.insert(productPricingValues).values({
          productPricingId,
          variantValueId: variant.variantValueId,
        });
      }
    });

    // Success response
    return handleSuccessReturn({});
  } catch (error) {
    // Handle and return the error response
    return handleFailureReturn(error);
  }
}
