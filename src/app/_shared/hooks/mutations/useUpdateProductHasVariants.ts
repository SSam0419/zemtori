import { UpdateProductHasVariants } from "@/app/_server/admin-actions/resources/product/update-product-base";

import { useTemplateMutation } from "../useTemplateMutation";

export function useUpdateProductHasVariants(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateProductHasVariants,
    mutationKey: ["product"],
    successMessage: "Product updated",
    successCallback: successCallback,
  });
}
