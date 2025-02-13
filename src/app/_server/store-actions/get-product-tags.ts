"use server";

import { getTenantDbBySubdomain } from "@/app/_server/db/get-tenant-db";

import { databaseSchemas } from "../schemas";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function GetProductTags({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) {
  try {
    const db = await getTenantDbBySubdomain(storeId);
    if (!db) {
      throw new Error("Store Not Found");
    }

    const query = `
      SELECT
        *
      FROM tag
      LEFT JOIN tag_product ON tag.id = tag_product.tag_id
      WHERE tag_product.product_id = ?
    `;

    const { rows } = await db.execute({
      sql: query,
      args: [productId],
    });

    const parsedData = databaseSchemas.tagSchema.array().safeParse(rows);

    if (!parsedData.success) {
      console.log(parsedData.error);
      throw new Error("Tag data is invalid");
    }

    return handleSuccessReturn(
      parsedData.data.map((tag) => ({
        id: tag.id,
        tagName: tag.tag_name,
      })),
    );
  } catch (error) {
    return handleFailureReturn(error);
  }
}
