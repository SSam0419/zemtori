import { GetCategories } from "@/app/_server/shared-actions/category/get-categories";
import { useQuery } from "@tanstack/react-query";

export function useCategoryQuery(shopId?: string) {
  return useQuery({
    queryKey: ["category-query", shopId],
    queryFn: async () => {
      const response = await GetCategories(shopId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
  });
}
