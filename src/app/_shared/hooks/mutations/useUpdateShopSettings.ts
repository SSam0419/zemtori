import {
    UpdateShopCurrency, UpdateShopOnlineStatus, UpdateShopSubdomain
} from '@/app/_server/admin-actions/resources/shop/update-settings';

import { useTemplateMutation } from '../useTemplateMutation';


export function useUpdateShopCurrency(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateShopCurrency,
    successMessage: "Shop currency updated successfully",
    errorMessage: "Shop currency update failed",
    mutationKey: ["update-shop-currency"],
    successCallback,
  });
}

export function useUpdateShopOnlineStatus(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateShopOnlineStatus,
    successMessage: "Shop status updated successfully",
    errorMessage: "Shop status update failed",
    mutationKey: ["update-shop-online-status"],
    successCallback,
  });
}

export function useUpdateShopSubdomain(successCallback?: () => void) {
  return useTemplateMutation({
    mutationFn: UpdateShopSubdomain,
    successMessage: "Shop subdomain updated successfully",
    errorMessage: "Shop subdomain update failed",
    mutationKey: ["update-shop-subdomain"],
    successCallback,
  });
}
