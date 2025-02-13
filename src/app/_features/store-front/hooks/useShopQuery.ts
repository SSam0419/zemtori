import { GetShop } from "@/app/_server/store-actions/get-shop";
import { useQuery } from "@tanstack/react-query";

export function useShopQuery({ shopId }: { shopId: string }) {
  return useQuery({
    queryKey: ["shop"],
    queryFn: async () => {
      const result = await GetShop({ shopId });
      if (!result.success || !result.payload) {
        throw new Error("Shop not found");
      }
      return result.payload;
    },
  });
}
