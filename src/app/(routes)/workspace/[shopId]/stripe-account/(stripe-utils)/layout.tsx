import { redirect } from "next/navigation";
import React from "react";

import { GetStripeAccountID } from "@/app/_server/admin-actions/resources/stripe/get-stripe-account-id";

async function StripeLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ shopId: string }> }>) {
  const { shopId } = await params;
  const accountId = await GetStripeAccountID();
  const hasAccount = accountId.success && accountId.payload && accountId.payload.id;

  if (!hasAccount) {
    redirect(`/workspace/${shopId}/stripe-account`);
  }

  return <>{children}</>;
}

export default StripeLayout;
