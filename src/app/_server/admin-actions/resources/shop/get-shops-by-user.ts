"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Get all shops for the logged-in user
export async function GetShop() {
  try {
    const db = await getTenantDbByAdmin();

    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.shops.findFirst();
    const shop = result ? result : null;
    return handleSuccessReturn(shop);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
