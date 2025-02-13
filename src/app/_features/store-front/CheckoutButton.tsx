"use client";
import { Button } from "@/app/_shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/app/_shared/components/ui/dialog";

import StripeCheckout from "./StripeCheckout";

export function CheckoutButton({
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Check Out</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[880px]">
        <DialogTitle>Checking out</DialogTitle>
        <StripeCheckout checkoutItems={checkoutItems} shopId={shopId} />
      </DialogContent>
    </Dialog>
  );
}
