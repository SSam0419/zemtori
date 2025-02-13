import GetProductByTagId from "@/app/_server/admin-actions/resources/product/get-products-by-tag-id";
import { useQuery } from "@tanstack/react-query";

export function useTagProductQuery(tagId: string | null) {
  return useQuery({
    queryKey: ["tag-product", tagId],
    queryFn: async () => {
      if (!tagId) {
        return [];
      }

      const response = await GetProductByTagId(tagId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
  });
}
