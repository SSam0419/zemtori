"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { shops } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { TenantRecordClient } from "@/app/_server/db/tenant-record-client";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function SaveStripeAccountID(accountId: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    await TenantRecordClient.execute({
      sql: "update tenant_record set stripe_account_id = ?",
      args: [accountId],
    });

    const result = await drizzleClient
      .update(shops)
      .set({
        stripeAccountId: accountId,
      })
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
