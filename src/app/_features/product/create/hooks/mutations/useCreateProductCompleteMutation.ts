import {
  CreateFullProduct,
  CreateProductCompleteBody,
} from "@/app/_server/admin-actions/composite/create-full-product";
import { useCustomToast } from "@/app/_shared/hooks/useCustomToast";
import { useMutation } from "@tanstack/react-query";

import { invalidateProductCache } from "../../server/invalidateProductPage";

export function useCreateProductCompleteMutation() {
  const { toastError, toastSuccess } = useCustomToast();
  return useMutation({
    mutationKey: ["create-product-complete"],
    mutationFn: async (data: CreateProductCompleteBody) => {
      const result = await CreateFullProduct({ ...data });
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result;
    },
    onError: (error) => {
      console.error(error);
      toastError(error.message);
    },
    onSuccess: async () => {
      toastSuccess("Product created successfully");
      await invalidateProductCache();
    },
  });
}
