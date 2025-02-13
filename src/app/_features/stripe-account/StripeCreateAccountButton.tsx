"use client";

import { Button } from "@/app/_shared/components/ui/button";

import { useCreateStripeAccountMutation } from "./hooks/useCreateStripeAccountMutation";

function StripeCreateAccountButton() {
  const createStripeAccountMutation = useCreateStripeAccountMutation();
  return (
    <Button
      className="w-full"
      isLoading={createStripeAccountMutation.isPending}
      onClick={async () => {
        await createStripeAccountMutation.mutate();
      }}
      disabled={createStripeAccountMutation.isPending || createStripeAccountMutation.isSuccess}
    >
      Create Stripe Account
    </Button>
  );
}

export default StripeCreateAccountButton;
