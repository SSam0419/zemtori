import { GetShop } from "@/app/_server/admin-actions/resources/shop/get-shops-by-user";
import { useQuery } from "@tanstack/react-query";

export function useShopQuery() {
  return useQuery({
    queryKey: ["shop-query"],
    queryFn: async () => {
      const response = await GetShop();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
  });
}
