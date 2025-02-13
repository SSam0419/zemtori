import { CreateVariantType } from "@/app/_server/admin-actions/resources/variant-type/create-variant-type";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCustomToast } from "../useCustomToast";

export function useCreateVariantTypeMutation(onSuccess?: () => void) {
  const { toastSuccess, toastError } = useCustomToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["create-variant-type"],
    mutationFn: async ({
      shopId,
      variantTypeName,
    }: {
      shopId: string;
      variantTypeName: string;
    }) => {
      const response = await CreateVariantType({
        shopId,
        variantTypeName,
      });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.payload;
    },
    onSuccess: async (data) => {
      await toastSuccess(`Variant type *${data.variantTypeName}* created successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["variant-type-query"],
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });

  return mutation;
}
