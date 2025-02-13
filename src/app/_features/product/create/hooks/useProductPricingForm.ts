import { useState } from "react";

import { ProductFormTypes } from "../types";

export function useProductPricingForm() {
  const [productPricing, setProductPricing] = useState<ProductFormTypes.ProductVariant>({
    hasVariants: true,
    defaultPrice: 0,
    defaultStock: 0,
    variants: [
      {
        variantValues: [],
        price: 0,
        stock: 0,
      },
    ],
  });

  function updateProductPricing(data: ProductFormTypes.ProductVariant) {
    setProductPricing(data);
  }

  return {
    productPricing,
    updateProductPricing,
  };
}
