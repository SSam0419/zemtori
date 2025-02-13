import { drizzle } from "drizzle-orm/libsql";

import { Client } from "@libsql/client";

import * as schema from "./drizzle-schemas";

export function getDrizzleClient(client: Client) {
  const db = drizzle({ client, schema });
  return db;
}
