"use server";

import Stripe from "stripe";

import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetStripeAccount(accountId: string) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const account = await stripe.accounts.retrieve(accountId);
    return handleSuccessReturn(account);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
