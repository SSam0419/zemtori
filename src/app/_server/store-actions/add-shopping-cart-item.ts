"use server";
import { and, eq } from "drizzle-orm";

import { auth } from "@clerk/nextjs/server";

import { getDrizzleClient } from "../db/drizzle";
import { shoppingCart } from "../db/drizzle-schemas";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { getUUID } from "../utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function AddShoppingCartItem({
  productId,
  quantity,
  shopId,
  variantPricingId,
}: {
  productId: string;
  quantity: number;
  shopId: string;
  variantPricingId?: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Login required");
    }

    const db = await getTenantDbBySubdomain(shopId);
    if (!db) {
      throw new Error("Shop not found");
    }
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.transaction(async (tx) => {
      //check if cart item already exists
      const existingCartItem = await tx.query.shoppingCart.findFirst({
        where: (shoppingCart, { eq, and }) => {
          return and(eq(shoppingCart.productId, productId), eq(shoppingCart.customerId, userId));
        },
      });

      if (existingCartItem) {
        await tx
          .update(shoppingCart)
          .set({
            quantity: existingCartItem.quantity + quantity,
          })
          .where(and(eq(shoppingCart.productId, productId), eq(shoppingCart.customerId, userId)));

        return {
          message: "Item added to shopping cart",
          data: existingCartItem,
        };
      } else {
        const result = await tx
          .insert(shoppingCart)
          .values({
            id: getUUID(),
            quantity,
            customerId: userId,
            productId,
            variantPricingId,
          })
          .returning({
            id: shoppingCart.id,
          });

        return {
          message: "Item added to shopping cart",
          data: result,
        };
      }
    });
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
