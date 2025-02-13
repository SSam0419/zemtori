"use server";
import { getTenantDbByAdmin, getTenantDbBySubdomain } from "@/app/_server/db/get-tenant-db";
import { databaseSchemas } from "@/app/_server/schemas";
import { ValidationError } from "@/app/_server/utils/errors";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetCategories(shopId?: string) {
  try {
    const db = shopId ? await getTenantDbBySubdomain(shopId) : await getTenantDbByAdmin();
    console.log("GetCategories", db);
    if (!db) {
      throw new Error("Shop DB not found");
    }
    const { rows } = await db.execute(`
      SELECT * FROM category
  `);

    // Validate the data using the schema
    const parsedData = databaseSchemas.categorySchema.array().safeParse(rows);
    if (!parsedData.success) {
      throw new ValidationError("Category data is invalid");
    }

    // Format the data for the frontend
    const formattedData = parsedData.data.map((category) => ({
      id: category.id,
      categoryName: category.category_name,
      description: category.description,
      parentCategoryId: category.parent_category_id,
    }));

    return handleSuccessReturn(formattedData);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
