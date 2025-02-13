import { CreateProductImage } from "@/app/_server/admin-actions/resources/product/create-product-image";
import { revalidateEditProductPage } from "@/app/_server/revalidate-paths";
import { useMutation } from "@tanstack/react-query";

import { useCustomToast } from "../useCustomToast";

export function useCreateProductImageMutation() {
  const { toastSuccess, toastError } = useCustomToast();
  return useMutation({
    mutationKey: ["create-product-image"],
    mutationFn: async ({ imageFile, productId }: { imageFile: File; productId: string }) => {
      try {
        const response = await CreateProductImage({
          imageFile,
          productId,
        });

        if (!response.success) {
          throw new Error(response.error.message || "Failed to create product image");
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create product image");
      }
    },
    onSuccess: async () => {
      await revalidateEditProductPage();
      await toastSuccess(`Product image created successfully`);
    },
    onError: async (error) => {
      await toastError(error.message);
    },
  });
}
