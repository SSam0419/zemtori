"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Create a new category
export async function GetOrderRecords() {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.orderRecord.findMany({
      with: {
        products: true,
      },
    });
    return handleSuccessReturn(result);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}
