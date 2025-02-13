"use client";
import React from "react";

import * as FormLayout from "@/app/_shared/components/layout/form-layout/FormLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_shared/components/ui/dialog";
import { TProductPricingDetails } from "@/app/_shared/types/global-types";

import { ProductImage } from "./store-product-list/StoreProductList.Card.Image";

function ShoppingCartVariantSelect({
  productPricing,
  onSubmit,
  triggerButton,
  status,
}: {
  status: "error" | "idle" | "pending" | "success";
  triggerButton: React.ReactNode;
  productPricing: TProductPricingDetails[];
  onSubmit: (selectedVariant: string, quantity: number) => Promise<void>;
}) {
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(
    productPricing[0].pricingId,
  );
  const [quantity, setQuantity] = React.useState("1");
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to shopping cart</DialogTitle>
          <DialogDescription>select a variant to add to your shopping cart</DialogDescription>
        </DialogHeader>
        <FormLayout.FormLayout
          onSubmit={async (e) => {
            e.preventDefault();
            //check number of quantity, must be number, must be integer, must be greater than 0
            if (Number(quantity) < 1 || !Number(quantity) || !Number.isInteger(Number(quantity))) {
              return alert("Quantity is not valid");
            }
            if (selectedVariant) {
              await onSubmit(selectedVariant, Number(quantity));
              setOpen(false);
            }
          }}
        >
          {productPricing.find((pp) => pp.pricingId === selectedVariant) &&
            productPricing.find((pp) => pp.pricingId === selectedVariant)?.attachedImages && (
              <ProductImage
                images={
                  productPricing.find((pp) => pp.pricingId === selectedVariant)?.attachedImages ??
                  []
                }
                priority={true}
              />
            )}

          <FormLayout.FormSelect
            formName="variant"
            label="Variant"
            options={
              productPricing.map((pp) => ({
                label: pp.variantValues.map((vv) => vv.variantValueName).join(" & "),
                value: pp.pricingId,
              })) || []
            }
            value={selectedVariant || ""}
            onValueChange={(value) => {
              setSelectedVariant(value);
            }}
            isRequired
          />
          <FormLayout.FormInput
            formName="quantity"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            isRequired
          />
          <FormLayout.FormSubmitButton isLoading={status === "pending"} />
        </FormLayout.FormLayout>
      </DialogContent>
    </Dialog>
  );
}

export default ShoppingCartVariantSelect;
