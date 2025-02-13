"use client";

import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

import { useToast } from "@/app/_shared/hooks/use-toast";

import Spinner from "../components/Spinner";

export function useCustomToast() {
  const { toast, dismiss } = useToast();

  function toastLoading(message: string) {
    return toast({
      description: (
        <p className="flex items-center gap-2">
          <Spinner /> {message}
        </p>
      ),
      duration: 2000,
    });
  }

  function toastSuccess(message: string) {
    toast({
      variant: "success",
      description: (
        <p className="flex items-center gap-2">
          <CircleCheck /> {message}
        </p>
      ),
    });
  }

  function toastError(message: string) {
    toast({
      variant: "error",
      description: (
        <p className="flex items-center gap-2">
          <CircleX /> {message}
        </p>
      ),
    });
  }

  function toastWarning(message: string) {
    toast({
      variant: "warning",
      description: (
        <p className="flex items-center gap-2">
          <TriangleAlert /> {message}
        </p>
      ),
    });
  }

  return { toastSuccess, toastError, toastWarning, toastLoading, dismiss };
}
