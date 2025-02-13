"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { categories } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Create a new category
export async function CreateCategory({
  categoryName,
  description,
  parentCategoryId,
}: {
  shopId: string;
  categoryName: string;
  description: string;
  parentCategoryId: string | undefined;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .insert(categories)
      .values({
        description,
        id: getUUID(),
        categoryName,
        parentCategoryId,
      })
      .returning({
        id: categories.id,
        categoryName: categories.categoryName,
        description: categories.description,
        parentCategoryId: categories.parentCategoryId,
        createdAt: categories.createdAt,
      });
    return handleSuccessReturn(result[0]);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}
