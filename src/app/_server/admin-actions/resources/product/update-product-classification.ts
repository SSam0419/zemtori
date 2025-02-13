"use server";

import { eq } from "drizzle-orm";

import { isUserSignedIn } from "@/app/_server/admin-actions/auth/user-auth";
import { CreateProductTags } from "@/app/_server/admin-actions/resources/product/create-product-tags";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { products } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { CheckCanProductUpdate } from "./check-can-product-update";
import { RemoveProductTags } from "./remove-product-tags";

export async function UpdateClassification({
  productId,
  categoryId,
  tagIds,
}: {
  productId: string;
  categoryId: string;
  tagIds: string[];
}) {
  try {
    const db = await getTenantDbByAdmin();
    const canBeUpdated = await CheckCanProductUpdate({ productId, db });
    if (!canBeUpdated) {
      return handleFailureReturn(Error("Product cannot be updated, it is already published"));
    }

    await isUserSignedIn();

    await Promise.all([
      UpdateProductCategory({
        productId,
        categoryId,
      }),
      UpdateProductTags({
        productId,
        tagIds,
      }),
    ]);

    return handleSuccessReturn({ success: true });
  } catch (error) {
    return handleFailureReturn(error);
  }
}

async function UpdateProductCategory({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string;
}) {
  const db = await getTenantDbByAdmin();
  const drizzleClient = await getDrizzleClient(db);
  const result = await drizzleClient
    .update(products)
    .set({
      categoryId,
    })
    .where(eq(products.id, productId))
    .returning();
  return result;
}

async function UpdateProductTags({ productId, tagIds }: { productId: string; tagIds: string[] }) {
  await RemoveProductTags({
    productId,
  });

  const data = await CreateProductTags({
    tagIds,
    productId,
  });

  return data;
}
