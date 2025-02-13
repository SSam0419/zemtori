"use server";

import Stripe from "stripe";

import { auth } from "@clerk/nextjs/server";

import { getDrizzleClient } from "../db/drizzle";
import { orderRecord, orderRecordProduct } from "../db/drizzle-schemas";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { getUUID } from "../utils/get-uuid";

export async function CheckoutItems({
  checkoutItems,
  shopId,
}: {
  checkoutItems: {
    productId: string;
    productPricingId: string;
    quantity: number;
  }[];
  shopId: string;
}) {
  const db = await getTenantDbBySubdomain(shopId);
  if (!db) {
    throw new Error("Database not found");
  }

  const drizzleClient = await getDrizzleClient(db);
  const shop = await drizzleClient.query.shops.findFirst();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    stripeAccount: shop!.stripeAccountId!,
  });

  const { userId: customerId } = await auth();

  if (!customerId) {
    throw new Error("User not authenticated");
  }

  //find the price in the database
  const pricing = await drizzleClient.query.productPricing.findMany({
    where: (productPricing, { inArray }) => {
      return inArray(
        productPricing.id,
        checkoutItems.map((item) => item.productPricingId),
      );
    },
  });

  //find the product in the database
  const products = await drizzleClient.query.products.findMany({
    where: (products, { inArray }) => {
      return inArray(
        products.id,
        checkoutItems.map((item) => item.productId),
      );
    },
    with: {
      status: true,
      images: true,
    },
  });

  const validProducts = products.filter((product) => {
    return product.status && product.status?.status === "PUBLISHED";
  });
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validProducts.map((product) => {
    return {
      quantity: checkoutItems.find((item) => item.productId === product.id)?.quantity || 0,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.productName,
          images: product.images.map((image) => image.url),
          description: product.description,
        },
        unit_amount: pricing.find((price) => price.productId === product.id)?.price || 0,
      },
    };
  });

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      line_items: lineItems,
      ui_mode: "embedded",
      mode: "payment",
      return_url: `http://${shopId}.${process.env.NEXT_PUBLIC_DOMAIN}`,
      metadata: {
        userId: customerId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
    },
    {
      stripeAccount: shop!.stripeAccountId!,
    },
  );

  const paymentIntent = session.payment_intent?.toString() || null;
  const sessionId = session.id.toString();
  const _orderId = await drizzleClient
    .insert(orderRecord)
    .values({
      stripeCheckoutSessionId: sessionId,
      stripePaymentIntentId: paymentIntent,
      customerId: customerId,
      id: getUUID(),
      orderStatus: "PENDING",
    })
    .returning();
  const orderId = _orderId[0].id;

  for (const product of validProducts) {
    await drizzleClient.insert(orderRecordProduct).values({
      orderRecordId: orderId,
      productPricingId: pricing.find((price) => price.productId === product.id)!.id,
      quantity: checkoutItems.find((item) => item.productId === product.id)?.quantity || 0,
    });
  }

  return { client_secret: session.client_secret };
}
