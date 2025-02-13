import { UpdateProductStatus } from "@/app/_server/admin-actions/resources/product/update-product-status";

import { useTemplateMutation } from "../useTemplateMutation";

export function useUpdateProductStatus(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateProductStatus,
    mutationKey: ["update-product-status"],
    successCallback,
  });
}
