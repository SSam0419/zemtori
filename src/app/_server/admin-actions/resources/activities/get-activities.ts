"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetActivities() {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.activities.findMany();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
