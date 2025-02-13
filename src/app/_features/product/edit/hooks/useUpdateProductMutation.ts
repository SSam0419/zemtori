import { UpdateProduct } from "@/app/_server/admin-actions/resources/product/update-product-base";
import { useTemplateMutation } from "@/app/_shared/hooks/useTemplateMutation";

export function useUpdateProductMutation() {
  return useTemplateMutation({
    mutationFn: UpdateProduct,
    mutationKey: ["update-product"],
    successMessage: "Product updated successfully",
    errorMessage: "Failed to update product",
  });
}
