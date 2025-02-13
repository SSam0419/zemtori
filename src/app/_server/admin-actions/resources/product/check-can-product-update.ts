"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getProductStatusId } from "@/app/_shared/types/global-types";
import { Client } from "@libsql/client";

export async function CheckCanProductUpdate({ productId, db }: { productId: string; db: Client }) {
  const drizzleClient = await getDrizzleClient(db);

  const productToBeUpdated = await drizzleClient.query.products.findMany({
    where: (prod, { eq }) => eq(prod.id, productId),
  });

  const canBeUpdated = productToBeUpdated.every(
    (product) => product.productStatusId !== getProductStatusId("PUBLISHED"),
  );

  return canBeUpdated;
}
