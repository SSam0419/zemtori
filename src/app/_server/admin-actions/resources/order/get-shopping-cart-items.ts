"use server";

import { z } from "zod";

import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { databaseSchemas } from "@/app/_server/schemas";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetShoppingCartItems() {
  try {
    const db = await getTenantDbByAdmin();
    const { rows } = await db.execute(`
      select sc.*, p.product_name as product_name from shopping_cart sc left join product p on sc.product_id = p.id
    `);

    const parsed = databaseSchemas.shoppingCartSchema
      .extend({ product_name: z.string().max(200) })
      .array()
      .parse(rows);

    return handleSuccessReturn(
      parsed.map((order) => ({
        orderId: order.id,
        quantity: order.quantity,
        productId: order.product_id,
        customerId: order.customer_id,
        productName: order.product_name,
      })),
    );
  } catch (error) {
    return handleFailureReturn(error);
  }
}
