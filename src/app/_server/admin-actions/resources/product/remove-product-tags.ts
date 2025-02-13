"use server";
import { eq } from "drizzle-orm";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { tagProducts } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { ValidationError } from "@/app/_server/utils/errors";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function RemoveProductTags({ productId }: { productId: string }) {
  try {
    // Validate input
    if (!productId) {
      throw new ValidationError("Tag IDs and Product ID must be provided.");
    }
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    await drizzleClient.delete(tagProducts).where(eq(tagProducts.productId, productId));
    return handleSuccessReturn({});
  } catch (error) {
    return handleFailureReturn(error);
  }
}
