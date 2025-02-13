import { ApiResponse } from "@/app/_server/utils/handle-return";
import { useCustomToast } from "@/app/_shared/hooks/useCustomToast";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  mutationKey: string[];
  successMessage?: string;
  errorMessage?: string;
  successCallback?: () => void;
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn" | "mutationKey" | "onSuccess" | "onError"
  >;
}

export function useTemplateMutation<TData, TVariables>({
  mutationFn,
  mutationKey,
  successMessage = "Operation successful",
  errorMessage = "Operation failed",
  successCallback,
  options = {},
}: MutationConfig<TData, TVariables>) {
  const { toastError, toastSuccess } = useCustomToast();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables);

      if (!response.success) {
        throw new Error(response.error.message);
      }

      return response.payload;
    },
    mutationKey,
    onError: (error) => {
      toastError(error.message || errorMessage);
    },
    onSuccess: () => {
      if (successCallback) successCallback();
      toastSuccess(successMessage);
    },
    ...options,
  });
}
