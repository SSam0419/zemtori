"use client";

import {
  useParams,
  useSearchParams,
} from "next/navigation";
import { useCategoryProductQuery } from "../hook/useCategoryProductQuery";
import ProductCard from "../product-view/ProductCard";
import SectionScrollLayout from "../SectionScrollLayout";

function CategoryProduct() {
  const searchParams =
    useSearchParams();
  const queryCategory =
    searchParams.get("query-category");
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const categoryProductQuery =
    useCategoryProductQuery(
      queryCategory,
    );

  if (!queryCategory) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Select a category to view
        products
      </div>
    );
  }

  if (categoryProductQuery.isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Error fetching products
        {
          categoryProductQuery.error
            .message
        }
      </div>
    );

  if (categoryProductQuery.isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading products...
      </div>
    );

  return (
    <SectionScrollLayout>
      {categoryProductQuery.data &&
        categoryProductQuery.data.map(
          (product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              shopId={shopId}
            />
          ),
        )}
    </SectionScrollLayout>
  );
}

export default CategoryProduct;
