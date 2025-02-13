"use client";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/app/_shared/components/ui/button";
import { TProductPricing } from "@/app/_shared/types/global-types";

import { useShoppingCartMutation } from "./hooks/useShoppingCartMutation";
import ShoppingCartVariantSelect from "./ShoppingCartVariantSelect";

function ShoppingCartButton({
  storeId,
  productId,
  productPricing,
}: {
  storeId: string;
  productId: string;
  productPricing: TProductPricing;
}) {
  const hasVariants = productPricing.hasVariants;
  const shoppingCartMutation = useShoppingCartMutation();

  if (hasVariants) {
    return (
      <ShoppingCartVariantSelect
        onSubmit={async (selectedVariant, quantity) => {
          await shoppingCartMutation.mutate({
            quantity,
            shopId: storeId,
            productId,
            variantPricingId: selectedVariant,
          });
        }}
        status={shoppingCartMutation.status}
        productPricing={productPricing.pricing || []}
        triggerButton={
          <Button className="w-full" type="button" isLoading={shoppingCartMutation.isPending}>
            <div className="flex w-full items-center gap-1">
              <ShoppingCart />
              Cart
            </div>
          </Button>
        }
      />
    );
  }

  return (
    <Button
      className="w-full"
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        if (!hasVariants) {
          await shoppingCartMutation.mutate({ quantity: 1, shopId: storeId, productId });
        }
      }}
      isLoading={shoppingCartMutation.isPending}
      disabled={shoppingCartMutation.isPending}
    >
      <div className="flex w-full items-center gap-1">
        <ShoppingCart />
        {shoppingCartMutation.isPending && "Adding To"} Cart
      </div>
    </Button>
  );
}

export default ShoppingCartButton;
