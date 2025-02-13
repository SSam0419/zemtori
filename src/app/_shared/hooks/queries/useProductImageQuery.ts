import { GetProductImages } from "@/app/_server/shared-actions/product/get-product-images";
import { useQuery } from "@tanstack/react-query";

export function useProductImageQuery({ productId }: { productId: string }) {
  return useQuery({
    queryKey: ["product-image"],
    queryFn: async () => {
      try {
        const images = await GetProductImages({
          productId,
        });
        return images;
      } catch {
        throw new Error("Error fetching product image");
      }
    },
  });
}
