"use server";

import { createClient } from "@tursodatabase/api";

import { TenantRecordClient } from "../db/tenant-record-client";
import { getUUID } from "../utils/get-uuid";

const turso = createClient({
  org: "ssam0419",
  token: process.env.TURSO_API_TOKEN!,
});

export async function CreateNewTenantDb({
  ownerClerkId,
  shopId,
}: {
  ownerClerkId: string;
  shopId: string;
}) {
  //check if user has already created a shop
  const { rows } = await TenantRecordClient.execute({
    sql: `select * from tenant_record where owner_clerk_id = ?`,
    args: [ownerClerkId],
  });

  if (rows.length > 0) {
    throw new Error("User has already created a shop");
  }

  const { hostname } = await turso.databases.create(shopId, {
    group: "default",
    schema: "osb-schema",
  });

  const result = await TenantRecordClient.execute({
    sql: `
        insert into tenant_record (id, shop_id, db_url, owner_clerk_id, subdomain)
        values (?, ?, ?, ?, ?)
      `,
    args: [getUUID(), shopId, hostname, ownerClerkId, shopId],
  });
  console.log(result);
  return "";
}
