import { Skeleton } from "@/app/_shared/components/ui/skeleton";

interface StoreProductListSkeletonProps {
  count?: number;
}

function StoreProductListSkeleton({ count = 12 }: StoreProductListSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="space-y-3">
          {/* Image skeleton */}
          <Skeleton className="h-60 w-full rounded-lg" />

          {/* Product name skeleton */}
          <Skeleton className="h-4 w-[80%]" />

          {/* Price skeleton */}
          <Skeleton className="h-4 w-[60%]" />

          {/* Additional details skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-[70%]" />
            <Skeleton className="h-3 w-[50%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StoreProductListSkeleton;
