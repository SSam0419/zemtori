"use server";

import { getTenantDbByAdmin, getTenantDbBySubdomain } from "../../db/get-tenant-db";
import { databaseSchemas } from "../../schemas";
import { handleFailureReturn, handleSuccessReturn } from "../../utils/handle-return";

export async function GetProductImages({
  productId,
  storeId,
}: {
  productId: string;
  storeId?: string;
}) {
  try {
    const db = storeId ? await getTenantDbBySubdomain(storeId) : await getTenantDbByAdmin();
    if (!db) {
      throw new Error("Store Not Found");
    }
    const { rows } = await db.execute({
      sql: `SELECT * FROM product_image WHERE product_id = ?`,
      args: [productId],
    });
    const parsedData = databaseSchemas.productImageSchema.array().safeParse(rows);
    if (!parsedData.success) {
      console.log(parsedData.error);
      throw new Error("Product Image data is invalid");
    }

    return handleSuccessReturn(
      parsedData.data.map((image) => ({
        imageId: image.id,
        imageUrl: image.url,
      })),
    );
  } catch (error) {
    console.error("GetProductImages error:", error);
    return handleFailureReturn(error);
  }
}
