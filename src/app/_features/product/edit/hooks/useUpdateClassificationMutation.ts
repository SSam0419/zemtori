import { UpdateClassification } from "@/app/_server/admin-actions/resources/product/update-product-classification";
import { useTemplateMutation } from "@/app/_shared/hooks/useTemplateMutation";

export function useUpdateClassificationMutation() {
  return useTemplateMutation({
    mutationKey: ["update-classification"],
    mutationFn: UpdateClassification,
    successMessage: "Classification updated successfully",
    errorMessage: "Failed to update classification",
  });
}
