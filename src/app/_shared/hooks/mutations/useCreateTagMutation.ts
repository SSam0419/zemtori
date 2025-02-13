import { CreateTag } from "@/app/_server/admin-actions/resources/tags/create-tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";

export function useCreateTagMutation() {
  const { toastSuccess, toastError } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-tag"],
    mutationFn: async ({
      shopId,
      formData,
    }: {
      shopId: string;
      formData: {
        tagName: string;
        description: string;
      };
    }) => {
      const response = await CreateTag(shopId, formData.tagName, formData.description);
      if (response.success) {
        return response.payload;
      }
      throw new Error(`${(response.error.name, ": ", response.error.message)}`);
    },

    onSuccess: async (data) => {
      await toastSuccess(`Tag *${data[0].tagName}* created successfully`);
      await queryClient.invalidateQueries({ queryKey: ["tag-query"] });
    },

    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
