"use server";

import { eq } from "drizzle-orm";

import { getDrizzleClient } from "../db/drizzle";
import { shoppingCart } from "../db/drizzle-schemas";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function UpdateShoppingCartItem({
  shopId,
  cartItemId,
  quantity,
}: {
  shopId: string;
  cartItemId: string;
  quantity: number;
}) {
  try {
    const db = await getTenantDbBySubdomain(shopId);
    if (!db) {
      throw new Error("Store Not Found");
    }
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .update(shoppingCart)
      .set({ quantity })
      .where(eq(shoppingCart.id, cartItemId))
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
