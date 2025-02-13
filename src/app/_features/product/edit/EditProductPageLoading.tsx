import { Skeleton } from "@/app/_shared/components/ui/skeleton";
import React from "react";

function EditProductPageLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default EditProductPageLoading;
