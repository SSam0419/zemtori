import { sql } from "drizzle-orm";

export function getUpdateTimestamp() {
  return sql`CURRENT_TIMESTAMP`;
}
