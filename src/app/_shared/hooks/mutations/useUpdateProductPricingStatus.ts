import {
  ActivateProductPricing,
  ArchiveProductPricing,
} from "@/app/_server/admin-actions/resources/product/update-product-pricing";

import { useTemplateMutation } from "../useTemplateMutation";

export function useActivateProductPricingStatus({
  successCallback,
}: {
  successCallback?: () => void;
}) {
  return useTemplateMutation({
    mutationFn: ActivateProductPricing,
    mutationKey: ["activate-product-pricing"],
    successCallback: successCallback,
  });
}

export function useArchiveProductPricingStatus({
  successCallback,
}: {
  successCallback?: () => void;
}) {
  return useTemplateMutation({
    mutationFn: ArchiveProductPricing,
    mutationKey: ["archive-product-pricing"],
    successCallback: successCallback,
  });
}
