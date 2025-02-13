"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export default async function GetProductByTagId(tagId: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.products.findMany({
      with: {
        category: true,
        status: true,
        tags: {
          where: (tag, { eq }) => {
            return eq(tag.tagId, tagId);
          },
        },
      },
    });

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
