import { AddShoppingCartItem } from "@/app/_server/store-actions/add-shopping-cart-item";
import { RemoveShoppingCartItem } from "@/app/_server/store-actions/remove-shopping-cart-item";
import { UpdateShoppingCartItem } from "@/app/_server/store-actions/update-shopping-cart-item";
import { useTemplateMutation } from "@/app/_shared/hooks/useTemplateMutation";
import { useQueryClient } from "@tanstack/react-query";

export function useShoppingCartMutation() {
  const queryClient = useQueryClient();
  return useTemplateMutation({
    mutationFn: AddShoppingCartItem,
    mutationKey: ["shopping-cart"],
    successMessage: "Item added to cart",
    successCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart"],
      });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useTemplateMutation({
    mutationFn: UpdateShoppingCartItem,
    mutationKey: ["shopping-cart"],
    successMessage: "Item updated",
    successCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart"],
      });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useTemplateMutation({
    mutationFn: RemoveShoppingCartItem,
    mutationKey: ["shopping-cart"],
    successMessage: "Item removed",
    successCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart"],
      });
    },
  });
}
