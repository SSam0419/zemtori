import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";
import { CreateCategory } from "@/app/_server/admin-actions/resources/category/create-category";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useCustomToast();

  return useMutation({
    mutationKey: ["create-category"],
    mutationFn: async ({
      shopId,
      formData,
    }: {
      shopId: string;
      formData: {
        categoryName: string;
        description: string;
        parentCategoryId?: string;
      };
    }) => {
      const response = await CreateCategory({
        shopId,
        categoryName: formData.categoryName,
        description: formData.description,
        parentCategoryId: formData.parentCategoryId,
      });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
    onSuccess: async (data) => {
      await toastSuccess(`Category *${data.categoryName}* created successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["category-query"],
      });
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
