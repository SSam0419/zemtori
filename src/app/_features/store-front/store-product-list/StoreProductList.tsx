import { GetStoreProducts } from "@/app/_server/store-actions/get-store-products";

import StorePagination from "../StorePagination";
import { ProductCard } from "./StoreProductList.Card";
import UtilsBar from "./StoreProductList.UtilsBar";

interface StoreProductListProps {
  categoryId?: string;
  storeId: string;
  currentPage?: number;
  limit?: number;
  search?: string;
}

async function StoreProductList({
  storeId,
  limit,
  currentPage,
  categoryId,
  search,
}: StoreProductListProps) {
  const response = await GetStoreProducts({
    storeId,
    params: { page: currentPage, limit, search },
    categoryId,
  });

  const products = response.success ? response.payload.data : [];

  if (!response.success) {
    return <div>{response.error.message}</div>;
  }

  return (
    <>
      <UtilsBar storeId={storeId} />
      <div className="my-12" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.base.productId}
            product={product}
            storeId={storeId}
            index={idx}
          />
        ))}
      </div>
      <div className="my-6"></div>
      <StorePagination
        totalPage={response.success ? response.payload.pagination.totalPages : 0}
        currentPage={response.success ? response.payload.pagination.page : 0}
      />
    </>
  );
}

export default StoreProductList;
