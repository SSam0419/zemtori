"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbClientByUserId } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Get a shop by its ID

export async function GetShop() {
  try {
    const db = await getTenantDbClientByUserId();
    // no db => user hasn't created a shop yet
    if (!db) {
      return handleSuccessReturn(null);
    }

    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.shops.findFirst();
    const shop = result ? result : null;
    return handleSuccessReturn(shop);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
