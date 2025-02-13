"use server";
import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { tagProducts } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function CreateProductTags({
  tagIds,
  productId,
}: {
  tagIds: string[];
  productId: string;
}) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    await drizzleClient.transaction(async (tx) => {
      for (const tagId of tagIds) {
        await tx.insert(tagProducts).values({
          tagId,
          productId,
        });
      }
    });
    return handleSuccessReturn({});
  } catch (error) {
    return handleFailureReturn(error);
  }
}
