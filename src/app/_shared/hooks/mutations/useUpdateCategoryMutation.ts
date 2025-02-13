import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";
import { UpdateCategory } from "@/app/_server/admin-actions/resources/category/update-category";

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useCustomToast();

  return useMutation({
    mutationKey: ["update-category"],
    mutationFn: async ({
      formData,
    }: {
      formData: {
        categoryId: string;
        categoryName: string;
        categoryDescription: string;
        parentCategoryId?: string | null | undefined;
      };
    }) => {
      const response = await UpdateCategory({
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        description: formData.categoryDescription,
        parentCategoryId: formData.parentCategoryId,
      });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
    onSuccess: async (data) => {
      await toastSuccess(`Category *${data.categoryName}* updated successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["category-query"],
      });
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
