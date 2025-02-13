import React from 'react';

import { GetStripeAccount } from '@/app/_server/admin-actions/resources/stripe/get-stripe-account';
import {
    GetStripeAccountID
} from '@/app/_server/admin-actions/resources/stripe/get-stripe-account-id';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/app/_shared/components/ui/card';

import { StripeAccountManagementUI, StripeOnBoardUI } from '../../_shared/StripeUI';
import StripeCreateAccountButton from './StripeCreateAccountButton';


async function StripeAccountPage() {
  const accountId = await GetStripeAccountID();

  const hasAccount = accountId.success && accountId.payload && accountId.payload.id;

  if (!hasAccount) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className="w-11/12">
          <CardHeader>
            <CardTitle>Start Accepting Payments with Stripe</CardTitle>
            <CardDescription>
              To accept payments, we partner with <strong>Stripe</strong> to offer a reliable and
              secure payment system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Once your customers check out successfully, you will receive payments directly in your
              Stripe account.
            </p>
            <p>Ready to get started? Click below to create your Stripe account!</p>
          </CardContent>
          <CardFooter className="">
            <StripeCreateAccountButton />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const account = await GetStripeAccount(accountId.payload.id!);
  if (!account.success || !account.payload) {
    throw new Error("Failed to retrieve account information");
  }

  const isPayoutsEnabled = account.payload.payouts_enabled;
  if (!isPayoutsEnabled) {
    return <StripeOnBoardUI />;
  }

  return <StripeAccountManagementUI />;
}

export default StripeAccountPage;
