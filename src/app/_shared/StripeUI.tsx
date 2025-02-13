"use client";
import React from "react";

import StripeUIProvider from "@/app/_shared/components/StripeUIProvider";
import {
  ConnectAccountManagement,
  ConnectAccountOnboarding,
  ConnectPaymentDetails,
  ConnectPayments,
  ConnectPayouts,
} from "@stripe/react-connect-js";

import { Button } from "./components/ui/button";
import { useCustomToast } from "./hooks/useCustomToast";

export function StripePaymentDetailsUI({ payment }: { payment: string }) {
  const [visible, setVisible] = React.useState(false);
  const [toastId, setToastId] = React.useState<string | null>(null);
  const { toastLoading, dismiss } = useCustomToast();

  function onOpen() {
    setVisible(true);
    const toastId = toastLoading("Opening payment details");
    setToastId(toastId.id);
  }

  function onClose() {
    setVisible(false);
    if (toastId) dismiss(toastId);
  }

  return (
    <div>
      <Button
        onClick={onOpen}
        variant="outline"
        type="button"
        isLoading={visible}
        disabled={visible}
      >
        View Details
      </Button>
      <StripeUIProvider>
        {visible && <ConnectPaymentDetails payment={payment} onClose={onClose} />}
      </StripeUIProvider>
    </div>
  );
}

export function StripePayoutUI() {
  // return <></>;
  return (
    <StripeUIProvider>
      <ConnectPayouts />
    </StripeUIProvider>
  );
}

export function StripePaymentsUI() {
  // return <></>;

  return (
    <StripeUIProvider>
      <ConnectPayments
      // Optional: specify filters to apply on load
      // defaultFilters={{
      //   amount: {greaterThan: 100},
      //   date: {before: new Date(2024, 0, 1)},
      //   status: ['partially_refunded', 'refund_pending', 'refunded'],
      //   paymentMethod: 'card',
      // }}
      />
    </StripeUIProvider>
  );
}

export function StripeOnBoardUI() {
  // return <></>;
  return (
    <StripeUIProvider>
      <ConnectAccountOnboarding
        onExit={() => {
          console.log("The account has exited onboarding");
        }}
        // Optional: make sure to follow our policy instructions above
        // fullTermsOfServiceUrl="{{URL}}"
        // recipientTermsOfServiceUrl="{{URL}}"
        // privacyPolicyUrl="{{URL}}"
        // skipTermsOfServiceCollection={false}
        // collectionOptions={{
        //   fields: 'eventually_due',
        //   futureRequirements: 'include',
        // }}
        // onStepChange={(stepChange) => {
        //   console.log(`User entered: ${stepChange.step}`);
        // }}
      />
    </StripeUIProvider>
  );
}

export function StripeAccountManagementUI() {
  // return <></>;
  return (
    <StripeUIProvider>
      <ConnectAccountManagement
      // Optional:
      // collectionOptions={{
      //   fields: 'eventually_due',
      //   futureRequirements: 'include',
      // }}
      />
    </StripeUIProvider>
  );
}
