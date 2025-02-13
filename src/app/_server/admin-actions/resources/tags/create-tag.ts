"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { tags } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function CreateTag(shopId: string, tagName: string, description: string) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .insert(tags)
      .values({
        id: getUUID(),
        tagName,
        description,
      })
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}
