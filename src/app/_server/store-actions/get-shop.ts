"use server";

import { getDrizzleClient } from "../db/drizzle";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function GetShop({ shopId }: { shopId: string }) {
  try {
    const db = await getTenantDbBySubdomain(shopId);

    if (!db) {
      return handleFailureReturn("Database not found");
    }

    const drizzleClient = await getDrizzleClient(db);

    const result = await drizzleClient.query.shops.findFirst();
    if (!result) {
      return handleFailureReturn("No shop found");
    }
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
