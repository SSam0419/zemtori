import { GetShoppingCartItems } from "@/app/_server/store-actions/get-shopping-cart-items";
import { useQuery } from "@tanstack/react-query";

export function useShoppingCartQuery({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ["shopping-cart"],
    queryFn: async () => await GetShoppingCartItems({ shopId }),
  });
}
