import {
  CreateStripeAccount,
  CreateStripeAccountLinks,
} from "@/app/_server/admin-actions/resources/stripe/create-stripe-acount";
import { SaveStripeAccountID } from "@/app/_server/admin-actions/resources/stripe/save-stripe-account-id";
import { useMutation } from "@tanstack/react-query";

export function useCreateStripeAccountMutation() {
  return useMutation({
    mutationFn: async () => {
      const account = await CreateStripeAccount();
      const accountId = account.success ? account.payload.id : null;
      if (accountId) {
        await SaveStripeAccountID(accountId);
        const url = await CreateStripeAccountLinks(accountId);
        const stripeOnboardingUrl = url.success ? url.payload.url : null;
        if (stripeOnboardingUrl) {
          //open new page on a new tab
          // window.open(stripeOnboardingUrl, "_blank");
          return { url: stripeOnboardingUrl };
        }
        throw new Error("Failed to create account");
      }
      throw new Error("Failed to create account");
    },

    mutationKey: ["create-stripe-account"],
  });
}
