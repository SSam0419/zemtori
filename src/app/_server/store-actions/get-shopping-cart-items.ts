"use server";

import { auth } from "@clerk/nextjs/server";

import { getDrizzleClient } from "../db/drizzle";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function GetShoppingCartItems({ shopId }: { shopId: string }) {
  try {
    const { userId } = await auth();
    if (!userId) return handleSuccessReturn([]);

    const db = await getTenantDbBySubdomain(shopId);
    if (!db) return handleSuccessReturn([]);
    console.log(`@GetShoppingCartItems getting shopping cart items for user ${userId}`);
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.shoppingCart.findMany({
      with: {
        product: {
          with: {
            images: true,
            pricing: {
              where: (pricing, { eq }) => eq(pricing.isDefault, true),
            },
          },
        },
        variantPricing: true,
      },
    });

    const formattedCartItems: {
      cartItemId: string;
      productId: string;
      productName: string;
      productImageUrls: string[];
      quantity: number;
      price: number;
      pricingId: string;
    }[] = [];

    result.forEach((item) => {
      formattedCartItems.push({
        cartItemId: item.id,
        productId: item.product.id,
        productName: item.product.productName,
        productImageUrls: item.product.images.map((image) => image.url),
        quantity: item.quantity,
        price:
          item.variantPricing == null ? item.product.pricing[0].price : item.variantPricing.price,
        pricingId:
          item.variantPricing == null ? item.product.pricing[0].id : item.variantPricing.id,
      });
    });

    console.log("formatted shopping cart items", formattedCartItems);
    return handleSuccessReturn(formattedCartItems);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
