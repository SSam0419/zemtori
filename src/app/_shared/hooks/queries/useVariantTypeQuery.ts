import { GetVariantTypes } from "@/app/_server/admin-actions/resources/variant-type/get-variant-types-by-shop-id";
import { useQuery } from "@tanstack/react-query";

export function useVariantTypeQuery(shopId: string) {
  return useQuery({
    queryKey: ["variant-type-query", shopId],
    queryFn: async () => {
      const response = await GetVariantTypes();

      if (!response.success) {
        throw new Error(response.error.message);
      }

      return response.payload;
    },
  });
}
