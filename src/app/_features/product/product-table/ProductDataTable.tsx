import { GetAdminProducts } from "@/app/_server/admin-actions/composite/get-admin-products";
import { DataTable } from "@/app/_shared/components/DataTable";

import { columns } from "./Columns";
import Pagination from "./Pagination";
import SearchQuery from "./SearchQuery";

async function ProductDataTable({
  page,
  limit,
  query,
}: {
  query: string | undefined;
  page: number | undefined;
  limit: number | undefined;
}) {
  const response = await GetAdminProducts({
    params: {
      page,
      limit,
      search: query,
    },
  });

  if (!response.success) {
    return <p>Something unexpected happened</p>;
  }

  const data = response.payload;

  return (
    <>
      <SearchQuery />
      <div className="my-2" />
      <DataTable key={page} data={data.data} columns={columns} />
      <div className="my-2" />
      <div className="flex w-full items-center justify-end">
        <Pagination totalPages={data.pagination.totalPages} />
      </div>
    </>
  );
}
export default ProductDataTable;
