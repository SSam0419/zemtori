"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { variantValues } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Create a new variant value

export async function CreateVariantValue({
  variantValueName,
  variantTypeId,
}: {
  variantValueName: string;
  variantTypeId: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .insert(variantValues)
      .values({
        id: getUUID(),
        variantValueName,
        variantTypeId,
      })
      .returning();

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
