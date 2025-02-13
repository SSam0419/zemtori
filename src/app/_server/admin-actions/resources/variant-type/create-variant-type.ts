"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { variantTypes } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Create a new variant type

export async function CreateVariantType({
  variantTypeName,
}: {
  shopId: string;
  variantTypeName: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .insert(variantTypes)
      .values({
        id: getUUID(),
        variantTypeName,
      })
      .returning();

    return handleSuccessReturn(result[0]);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
