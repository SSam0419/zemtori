"use client";
import { useQueryState } from "nuqs";
import React from "react";
import { useTagProductQuery } from "../hook/useTagProductQuery";
import { useParams } from "next/navigation";
import ProductCard from "../product-view/ProductCard";
import SectionScrollLayout from "../SectionScrollLayout";

function TagProduct() {
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const [selectedTagId, ,] =
    useQueryState("query-tag");
  const tagProductQuery =
    useTagProductQuery(selectedTagId);

  if (tagProductQuery.isError) {
    return (
      <p>
        Something went wrong, try again
      </p>
    );
  }
  return (
    <SectionScrollLayout>
      {tagProductQuery.data &&
        tagProductQuery.data.map(
          (product, index) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                shopId={shopId}
              />
            );
          },
        )}
    </SectionScrollLayout>
  );
}

export default TagProduct;
