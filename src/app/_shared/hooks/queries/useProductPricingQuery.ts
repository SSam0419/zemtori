import { GetProductPricing } from "@/app/_server/admin-actions/resources/product/get-product-pricing";
import { useQuery } from "@tanstack/react-query";

export function useProductPricingQuery({ productId }: { productId: string }) {
  return useQuery({
    queryKey: ["product-pricing", productId],
    queryFn: async () => {
      console.log("productId", productId);
      const result = await GetProductPricing(productId);
      if (!result.success || !result.payload) {
        throw new Error("Product pricing not found");
      }
      return result.payload;
    },
  });
}
