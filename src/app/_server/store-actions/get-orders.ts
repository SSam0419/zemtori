"use server";

import { auth } from "@clerk/nextjs/server";

import { getDrizzleClient } from "../db/drizzle";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

export async function GetOrders({ shopId }: { shopId: string }) {
  try {
    const { userId: customerId } = await auth();
    if (!customerId) {
      throw new Error("Customer Not Found");
    }
    const db = await getTenantDbBySubdomain(shopId);

    if (!db) {
      throw new Error("Store Not Found");
    }
    const drizzleClient = await getDrizzleClient(db);

    const orders = await drizzleClient.query.orderRecord.findMany({
      where: (order, { eq }) => {
        return eq(order.customerId, customerId);
      },
      with: {
        products: {
          with: {
            productPricing: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return handleSuccessReturn(orders);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
