import GetProductByCategoryId from "@/app/_server/admin-actions/resources/product/get-products-by-category-id";
import { useQuery } from "@tanstack/react-query";

export function useCategoryProductQuery(categoryId: string | null) {
  return useQuery({
    queryKey: ["category-product", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        return [];
      }

      const response = await GetProductByCategoryId(categoryId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
  });
}
