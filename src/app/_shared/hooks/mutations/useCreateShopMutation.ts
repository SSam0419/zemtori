"use client";

import { CreateShop } from "@/app/_server/admin-actions/resources/shop//create-shop";
import { useMutation } from "@tanstack/react-query";

export function useCreateShopMutation() {
  return useMutation({
    mutationFn: async (shopData: { name: string; address: string; description: string }) => {
      const response = await CreateShop({
        shopName: shopData.name,
        address: shopData.address,
        description: shopData.description,
      });
      if (response.success === false) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
    mutationKey: ["create-shop-mutation"],
    onSuccess: (data) => {
      const shopId = data[0].id;
      // Navigate to the newly created shop
      window.location.href = `/workspace/${shopId}?firstTime=true`;
    },
  });
}
