"use client";
import React, { useCallback } from "react";

import { CheckoutItems } from "@/app/_server/store-actions/checkout-items";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useShopQuery } from "./hooks/useShopQuery";

function StripeCheckout({
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
  const shopQuery = useShopQuery({ shopId });

  const fetchClientSecret = useCallback(async () => {
    const { client_secret } = await CheckoutItems({
      checkoutItems,
      shopId,
    });
    console.log(client_secret);
    if (!client_secret) {
      throw new Error("Client secret not found");
    }
    return client_secret;
  }, [checkoutItems, shopId]);
  const options = { fetchClientSecret };

  const stripeAccountId = shopQuery.data && shopQuery.data.stripeAccountId;
  if (!stripeAccountId) {
    return <></>;
  }
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!, {
    stripeAccount: stripeAccountId,
  });

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

export default StripeCheckout;
