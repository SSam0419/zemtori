"use server";
import {
  Pool,
  neonConfig,
} from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;

export async function TestRollback() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL,
  });
  pool.on("error", (err) =>
    console.error(err),
  );
  const client = await pool.connect();
  try {
    console.info("test rollback");
    await client.query("BEGIN");

    //test insert random product
    await client.query(`
      insert into product (shop_id, product_name, description)
      values ('e892e88a-6cb7-49c3-a9ae-b58d112b2a48', 'rollback with pool', 'rollback with pool')
    `);

    console.info(
      "test rollback finished",
    );
    throw new Error("test rollback");
  } catch (err) {
    console.error(err);
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
