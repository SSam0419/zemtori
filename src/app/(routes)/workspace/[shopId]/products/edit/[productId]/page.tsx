import React, { Suspense } from "react";

import EditProductPage from "@/app/_features/product/edit/EditProductPage";
import EditProductPageLoading from "@/app/_features/product/edit/EditProductPageLoading";

async function page(props: {
  params: Promise<{
    shopId: string;
    productId: string;
  }>;
}) {
  const params = await props.params;
  return (
    <Suspense fallback={<EditProductPageLoading />}>
      <EditProductPage productId={params.productId} />
    </Suspense>
  );
}

export default page;
