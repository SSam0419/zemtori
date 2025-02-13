"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetTags() {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.tags.findMany();
    return handleSuccessReturn(result);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}

export async function GetTagsByProductId(productId: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.tags.findMany({
      with: {
        products: {
          where: (product, { eq }) => {
            return eq(product.productId, productId);
          },
        },
      },
    });
    return handleSuccessReturn(result);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}
