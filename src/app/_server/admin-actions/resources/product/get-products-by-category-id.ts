"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export default async function GetProductByCategoryId(categoryId: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.products.findMany({
      with: {
        category: true,
        status: true,
      },
      where: (products, { eq }) => {
        return eq(products.categoryId, categoryId);
      },
    });

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
