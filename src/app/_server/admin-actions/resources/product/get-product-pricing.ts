"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetProductPricing(productId: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.productPricing.findMany({
      with: {
        variantValues: {
          with: {
            variantValue: true,
          },
        },
      },
      where: (prod, { eq }) => {
        return eq(prod.productId, productId);
      },
    });
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
