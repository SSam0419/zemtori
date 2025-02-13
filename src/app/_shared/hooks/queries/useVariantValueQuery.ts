import { GetVariantValuesByShopId } from "@/app/_server/admin-actions/resources/variant-value/get-variant-values-by-shop-id";
import { useQuery } from "@tanstack/react-query";

export function useVariantValueQuery(shopId?: string) {
  return useQuery({
    queryKey: ["variant-value-query", shopId],
    queryFn: async () => {
      const response = await GetVariantValuesByShopId(shopId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
  });
}
