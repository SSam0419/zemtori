// app/api/account_session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { GetStripeAccountID } from "../../_server/admin-actions/resources/stripe/get-stripe-account-id";

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const accountId = await GetStripeAccountID();
    if (!accountId.success || !accountId.payload || !accountId.payload.id) {
      return NextResponse.json({ error: "No stripe account found" }, { status: 404 });
    }

    const accountSession = await stripe.accountSessions.create({
      account: accountId.payload.id,
      components: {
        payment_details: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: false,
          },
        },
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
        account_management: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
        balances: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
          },
        },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
            external_account_collection: true,
          },
        },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: false,
          },
        },
      },
    });

    return NextResponse.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account session",
      error,
    );
    return NextResponse.json({ error: "Failed to create account session" }, { status: 500 });
  }
}
