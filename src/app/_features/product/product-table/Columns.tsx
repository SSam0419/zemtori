"use client";

import ProductStatusBadge from "@/app/_shared/components/ProductStatusBadge";
import { Badge } from "@/app/_shared/components/ui/badge";
import { TProduct } from "@/app/_shared/types/global-types";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import EditProductButton from "./EditProductButton";

const columnHelper = createColumnHelper<TProduct>();
export const columns: ColumnDef<TProduct>[] = [
  columnHelper.display({
    id: "status",
    header: "Status",
    cell: (props) => <ProductStatusBadge status={props.row.original.base.status} />,
  }),
  {
    accessorKey: "base.productName",
    header: "Product",
  },
  {
    accessorKey: "base.description",
    header: "Description",
  },
  {
    accessorKey: "category.categoryName",
    header: "Category",
  },
  columnHelper.display({
    id: "tags",
    header: "Tags",
    cell: (props) => (
      <div className="flex flex-wrap gap-1">
        {props.row.original.tags.map((t) => (
          <Badge key={t.tagId} className="w-fit">
            {t.tagName}
          </Badge>
        ))}
      </div>
    ),
  }),
  columnHelper.display({
    id: "price",
    header: "Price",
    cell: (props) => {
      const defaultPrice = props.row.original.productPricing.pricing.find(
        (price) => price.isDefault,
      );

      if (!props.row.original.productPricing.hasVariants) return `$${defaultPrice?.price}`;
      if (props.row.original.productPricing.pricing.length == 0) return "-";
      let lowestPrice = props.row.original.productPricing.pricing?.[0].price || 0;
      let highestPrice = props.row.original.productPricing.pricing?.[0].price || 0;
      for (const v of props.row.original.productPricing.pricing) {
        const price = v.price;
        if (price < lowestPrice) {
          lowestPrice = price;
        }
        if (price > highestPrice) {
          highestPrice = price;
        }
      }
      return <p>{`$${lowestPrice} - ${highestPrice}`}</p>;
    },
  }),
  columnHelper.display({
    id: "stock",
    header: "Stock",
    cell: (props) => {
      const stock = props.row.original.productPricing.pricing.find((price) => price.isDefault);

      if (!props.row.original.productPricing.hasVariants) return `${stock?.stock}`;
      if (props.row.original.productPricing.pricing.length == 0) return "-";
      let lowestStock = props.row.original.productPricing.pricing?.[0].stock || 0;
      let highestStock = props.row.original.productPricing.pricing?.[0].stock || 0;
      for (const v of props.row.original.productPricing.pricing) {
        const stock = v.stock;
        if (stock < lowestStock) {
          lowestStock = stock;
        }
        if (stock > highestStock) {
          highestStock = stock;
        }
      }
      if (lowestStock == highestStock) return <p>{lowestStock}</p>;
      return <p>{`${lowestStock} - ${highestStock}`}</p>;
    },
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: (props) => {
      const productId = props.row.original.base.productId;

      return <EditProductButton productId={productId} />;
    },
  }),
];
