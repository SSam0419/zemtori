"use server";

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

import { handleFailureReturn, handleSuccessReturn } from '@/app/_server/utils/handle-return';


export async function CreateStripeAccountLinks(accountId: string) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { url } = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${BASE_URL}/workspace/431ccf84-c92f-4dc9-9436-edb0989a922e/billing`,
      return_url: `${BASE_URL}/workspace/431ccf84-c92f-4dc9-9436-edb0989a922e/billing/success/${accountId}`,
      type: "account_onboarding",
      collection_options: {
        fields: "eventually_due",
      },
    });
    return handleSuccessReturn({ url });
  } catch (error) {
    return handleFailureReturn(error);
  }
}

export async function CreateStripeAccount() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const account = await stripe.accounts.create({
      default_currency: "usd",
    });
    const accountId = account.id;
    await revalidatePath("/workspace/[shopId]/stripe-account");
    return handleSuccessReturn({
      id: accountId,
    });
  } catch (error) {
    return handleFailureReturn(error);
  }
}
