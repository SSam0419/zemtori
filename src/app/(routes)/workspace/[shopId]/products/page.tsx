import { Suspense } from "react";

import ProductDataTable from "@/app/_features/product/product-table/ProductDataTable";
import { DataTableSkeleton } from "@/app/_shared/components/DataTableSkeleton";

async function page(props: {
  searchParams?: Promise<{
    limit?: number;
    page?: number;
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page;
  const limit = searchParams?.limit;
  const query = searchParams?.query;

  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <ProductDataTable page={page} limit={limit} query={query} />
    </Suspense>
  );
}

export default page;
