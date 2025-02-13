"use server";
import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { products } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";
import { getProductStatusId, TProductStatus } from "@/app/_shared/types/global-types";

import { CheckCanProductUpdate } from "./check-can-product-update";

export async function UpdateProduct({
  productName,
  productDescription,
  productStatus,
  productId,
}: {
  productName: string;
  productDescription: string;
  productStatus: TProductStatus;
  productId: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const canBeUpdated = await CheckCanProductUpdate({ productId, db });
    if (!canBeUpdated) {
      return handleFailureReturn(Error("Product cannot be updated, it is already published"));
    }

    await drizzleClient
      .update(products)
      .set({
        productName,
        description: productDescription,
        productStatusId: getProductStatusId(productStatus),
      })
      .where(eq(products.id, productId));

    return handleSuccessReturn({
      message: "Product updated successfully",
    });
  } catch (error) {
    return handleFailureReturn(error);
  }
}

export async function UpdateProductHasVariants({
  productId,
  hasVariants,
}: {
  productId: string;
  hasVariants: boolean;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    await drizzleClient
      .update(products)
      .set({
        hasVariants: hasVariants,
      })
      .where(eq(products.id, productId));

    return handleSuccessReturn({
      message: "Product updated successfully",
    });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
