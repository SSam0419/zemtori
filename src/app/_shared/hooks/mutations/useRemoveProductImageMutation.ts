import { RemoveProductImage } from "@/app/_server/admin-actions/resources/product/remove-product-image";
import { revalidateEditProductPage } from "@/app/_server/revalidate-paths";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";

export function useRemoveProductImageMutation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useCustomToast();
  return useMutation({
    mutationKey: ["remove-product-image"],
    mutationFn: async ({ imageUrl, imageId }: { imageUrl: string; imageId: string }) => {
      try {
        await RemoveProductImage({
          imageUrl,
          imageId,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Failed to remove product image");
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["product-image"],
      });
      await revalidateEditProductPage();
      await toastSuccess(`Product image removed successfully`);
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
