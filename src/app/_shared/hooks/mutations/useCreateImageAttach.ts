import { AttachPricingToImage } from "@/app/_server/admin-actions/resources/product-image/attach-pricing-to-image";

import { useTemplateMutation } from "../useTemplateMutation";

export function useCreateImageAttach(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: AttachPricingToImage,
    mutationKey: ["create-image-attach"],
    successCallback,
  });
}
