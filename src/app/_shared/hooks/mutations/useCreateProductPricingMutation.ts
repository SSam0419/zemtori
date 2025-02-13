import { AddProductPricing } from "@/app/_server/admin-actions/resources/product/add-product-pricing";

import { useTemplateMutation } from "../useTemplateMutation";

export function useCreateProductPricingMutation(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: AddProductPricing,
    mutationKey: ["create-product-pricing"],
    successMessage: "Product pricing created successfully",
    errorMessage: "Product pricing creation failed",
    successCallback: successCallback,
  });
}
