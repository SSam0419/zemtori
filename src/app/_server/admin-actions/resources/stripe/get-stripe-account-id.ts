"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetStripeAccountID() {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const result = await drizzleClient.query.shops.findFirst();
    if (!result) {
      return handleFailureReturn("No stripe account found");
    }
    const id = result.stripeAccountId?.toString();
    return handleSuccessReturn({ id });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
