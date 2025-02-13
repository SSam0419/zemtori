"use server";
import { GetStripeAccount } from "./admin-actions/resources/stripe/get-stripe-account";
import { getDrizzleClient } from "./db/drizzle";
import { getTenantDbBySubdomain } from "./db/get-tenant-db";

export async function isStoreValid(subdomain: string) {
  try {
    const db = await getTenantDbBySubdomain(subdomain);
    if (!db) {
      return false;
    }
    const drizzleClient = await getDrizzleClient(db);
    const storeAccountIdQuery = await drizzleClient.query.shops.findFirst();
    if (!storeAccountIdQuery) {
      return false;
    }
    const stripeAccountId = storeAccountIdQuery.stripeAccountId;
    if (!stripeAccountId) {
      return false;
    }
    const stripeAccount = await GetStripeAccount(stripeAccountId);
    if (!stripeAccount.success || !stripeAccount.payload.payouts_enabled) {
      return false;
    }
    console.log(`Store ${subdomain} is valid`);
    return true;
  } catch (error) {
    console.error("Error opening store URL:", error);
    return false;
  }
}
