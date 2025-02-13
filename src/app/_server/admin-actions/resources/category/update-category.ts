"use server";
import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { categories } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUpdateTimestamp } from "@/app/_server/db/get-update-timestamp";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Update an existing category
export async function UpdateCategory({
  categoryId,
  categoryName,
  description,
  parentCategoryId,
}: {
  categoryId: string;
  categoryName: string;
  description: string;
  parentCategoryId: string | undefined | null;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .update(categories)
      .set({
        categoryName,
        description,
        parentCategoryId,
        updatedAt: getUpdateTimestamp(),
      })
      .where(eq(categories.id, categoryId))
      .returning({
        id: categories.id,
        categoryName: categories.categoryName,
        description: categories.description,
        parentCategoryId: categories.parentCategoryId,
      });

    return handleSuccessReturn(result[0]);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
