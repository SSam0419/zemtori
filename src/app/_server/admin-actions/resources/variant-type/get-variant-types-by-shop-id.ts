"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Get variant types by shop ID

export async function GetVariantTypes() {
  try {
    console.log("GetVariantTypes");
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.variantTypes.findMany();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
