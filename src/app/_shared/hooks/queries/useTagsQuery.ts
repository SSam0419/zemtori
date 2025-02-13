import { GetTags } from "@/app/_server/admin-actions/resources/tags/get-tags-by-shop-id";
import { useQuery } from "@tanstack/react-query";

export function useTagsQuery() {
  return useQuery({
    queryKey: ["tag-query"],
    queryFn: async () => {
      const response = await GetTags();
      if (response.success) {
        return response.payload;
      }
      throw new Error(response.error.message);
    },
  });
}
