import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { orderRecord } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbBySubdomain } from "@/app/_server/db/get-tenant-db";
import { TenantRecordClient } from "@/app/_server/db/tenant-record-client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Stripe webhook signing secret
const webhookSecret = "whsec_yIJPrnpi6ChyArIoeFxBIxihjHZbwXUv" as string;

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received");
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    // Read the raw body to validate the webhook signature
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    if (!(err instanceof Error)) {
      console.error("⚠️ Webhook Error: ", err);
      return new NextResponse(`Webhook Error: ${err}`, { status: 500 });
    }

    console.error("⚠️ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("✅ Success:", event.type);
  // console.log(event.data.object);
  const accountId = event.account;
  if (!accountId) {
    console.error("⚠️ No account ID found in event");
    return new NextResponse("No account ID found in event", { status: 400 });
  }

  const rows = await TenantRecordClient.execute({
    sql: "select shop_id from tenant_record where stripe_account_id = ?",
    args: [accountId],
  });

  if (rows.rows.length === 0 || !rows.rows[0].shop_id) {
    console.error("⚠️ No shop found for account ID");
    return new NextResponse("No shop found for account ID", { status: 400 });
  }

  const shopId = rows.rows[0].shop_id as string;
  const db = await getTenantDbBySubdomain(shopId);

  if (!db) {
    console.error("⚠️ Database not found");
    return new NextResponse("Database not found", { status: 500 });
  }

  const drizzleClient = await getDrizzleClient(db);

  // Handle different event types
  switch (event.type) {
    case "charge.refunded":
      console.log("Charge refunded, charge ->", event.data.object.id);
      await drizzleClient
        .update(orderRecord)
        .set({
          paymentStatus: "REFUNDED",
        })
        .where(eq(orderRecord.stripeCheckoutSessionId, event.data.object.id));
      break;
    case "payment_intent.canceled":
      console.log(
        "Payment intent amount capturable updated, payment_intent ->",
        event.data.object.id,
      );
      await drizzleClient
        .update(orderRecord)
        .set({
          paymentStatus: "CANCELED",
        })
        .where(eq(orderRecord.stripePaymentIntentId, event.data.object.id));
      break;
    case "payment_intent.partially_funded":
      console.log("Payment intent partially funded, payment_intent ->", event.data.object.id);
      await drizzleClient
        .update(orderRecord)
        .set({
          paymentStatus: "PARTIALLY FUNDED",
        })
        .where(eq(orderRecord.stripePaymentIntentId, event.data.object.id));
      break;
    case "payment_intent.payment_failed":
      console.log("Payment intent failed, payment_intent ->", event.data.object.id);
      await drizzleClient
        .update(orderRecord)
        .set({
          paymentStatus: "PAYMENT FAILED",
        })
        .where(eq(orderRecord.stripePaymentIntentId, event.data.object.id));
      break;
    case "payment_intent.created":
      console.log("Payment intent created, payment_intent ->", event.data.object.id);
      await drizzleClient
        .update(orderRecord)
        .set({
          stripePaymentIntentId: event.data.object.id,
          paymentStatus: "PENDING",
        })
        .where(eq(orderRecord.stripePaymentIntentId, event.data.object.id));
      break;
    case "payment_intent.succeeded":
      console.log("Payment intent succeeded, payment_intent ->", event.data.object.id);
      await drizzleClient
        .update(orderRecord)
        .set({
          paymentStatus: "PAYMENT SUCCEEDED",
        })
        .where(eq(orderRecord.stripePaymentIntentId, event.data.object.id));
      break;
    case "checkout.session.completed":
      console.log(
        "Checkout session completed, payment_intent ->",
        event.data.object.payment_intent,
      );
      await drizzleClient
        .update(orderRecord)
        .set({
          stripePaymentIntentId: event.data.object.payment_intent!.toString(),
        })
        .where(eq(orderRecord.stripeCheckoutSessionId, event.data.object.id));
      // Fulfill the order
      break;
    case "checkout.session.expired":
      console.log("Checkout session expired, session id ->", event.data.object.id);
      await drizzleClient
        .delete(orderRecord)
        .where(eq(orderRecord.stripeCheckoutSessionId, event.data.object.id));
      // to do -> delete the order
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to Stripe to acknowledge receipt of the event
  return new NextResponse("Webhook received", { status: 200 });
}
