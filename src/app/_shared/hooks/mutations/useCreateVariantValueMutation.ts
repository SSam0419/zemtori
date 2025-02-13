import { CreateVariantValue } from "@/app/_server/admin-actions/resources/variant-value/create-variant-value";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";

export function useCreateVariantValueMutation(onSuccess?: () => void) {
  const { toastSuccess, toastError } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-variant-value"],
    mutationFn: async ({
      variantTypeId,
      variantValueName,
    }: {
      variantTypeId: string;
      variantValueName: string;
    }) => {
      const response = await CreateVariantValue({
        variantTypeId,
        variantValueName,
      });

      if (!response.success) {
        throw new Error(response.error.message);
      }

      return response.payload;
    },
    onSuccess: async (data) => {
      await toastSuccess(`Variant value *${data[0].variantValueName}* created successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["variant-value-query"],
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
