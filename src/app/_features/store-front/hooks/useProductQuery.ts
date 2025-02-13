import { GetStoreProducts } from "@/app/_server/store-actions/get-store-products";
import { useQueries, useQuery } from "@tanstack/react-query";

export function useProductQuery({ productId, shopId }: { shopId: string; productId: string }) {
  return useQuery({
    queryKey: ["get-product", productId, shopId],
    queryFn: async () => {
      try {
        const response = await GetStoreProducts({ productId, storeId: shopId });
        if (!response.success) throw new Error(response.error.message);
        return response.payload.data;
      } catch (error) {
        console.error(error);
        if (error instanceof Error) throw new Error(error.message);
        throw new Error("An error occurred while fetching product data");
      }
    },
  });
}

export function useProductQueries({ ids }: { ids: { shopId: string; productId: string }[] }) {
  return useQueries({
    queries: ids.map(({ shopId, productId }) => ({
      queryKey: ["get-product", productId, shopId],
      queryFn: async () => {
        try {
          const response = await GetStoreProducts({ productId, storeId: shopId });
          if (!response.success) throw new Error(response.error.message);
          return response.payload.data;
        } catch (error) {
          console.error(error);
          if (error instanceof Error) throw new Error(error.message);
          throw new Error("An error occurred while fetching product data");
        }
      },
    })),
  });
}
