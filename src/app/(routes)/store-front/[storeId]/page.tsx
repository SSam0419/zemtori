import React, { Suspense } from "react";

import StoreProductList from "@/app/_features/store-front/store-product-list/StoreProductList";
import StoreProductListSkeleton from "@/app/_features/store-front/store-product-list/StoreProductList.Skeleton";

async function page({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{
    page: string;
    limit: string;
    category: string | undefined;
    q: string | undefined;
  }>;
}) {
  const { storeId } = await params;
  const { page, limit, category, q } = await searchParams;
  return (
    <Suspense fallback={<StoreProductListSkeleton />}>
      <StoreProductList
        storeId={storeId}
        currentPage={Number(page) || 1}
        limit={Number(limit) || 6 * 6}
        categoryId={category}
        search={q}
      />
    </Suspense>
  );
}

export default page;
