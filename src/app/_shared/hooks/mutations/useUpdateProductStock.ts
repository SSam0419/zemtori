import { UpdateProductStock } from "@/app/_server/admin-actions/resources/product/update-product-stock";

import { useTemplateMutation } from "../useTemplateMutation";

export function useUpdateProductStock(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateProductStock,
    mutationKey: ["update-product-stock"],
    successCallback,
  });
}
