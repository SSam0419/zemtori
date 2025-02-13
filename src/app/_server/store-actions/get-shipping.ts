"use server";

import Stripe from "stripe";

import { auth } from "@clerk/nextjs/server";

import { getDrizzleClient } from "../db/drizzle";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";

export async function GetShipping({
  checkoutSessionId,
  shopId,
}: {
  checkoutSessionId: string;
  shopId: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not Authorized");
  }
  console.log({ userId, shopId });
  const db = await getTenantDbBySubdomain(shopId);
  if (!db) {
    throw new Error("Store Not Found");
  }

  const drizzleClient = await getDrizzleClient(db);
  const shop = await drizzleClient.query.shops.findFirst();
  const stripeAccount = shop?.stripeAccountId;

  if (!stripeAccount) {
    throw new Error("Stripe Account Not Found");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    stripeAccount,
  });
  const charge = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  const shippingDetails = charge.shipping_details;

  return shippingDetails;
}
