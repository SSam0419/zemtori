import { cn } from "@/app/_shared/lib/utils";
import Link from "next/link";
import React from "react";

function ProductCard({
  product,
  index,
  shopId,
}: {
  shopId: string;
  product: {
    id: string;
    productName: string;
    description: string;
  };
  index: number;
}) {
  return (
    <div
      key={product.id}
      className={cn(
        "grid grid-cols-6 gap-2 p-2",
        index % 2 === 0
          ? "bg-gray-100"
          : "",
      )}
    >
      <p>{product.productName}</p>
      <p className="col-span-4 text-muted-foreground">
        {product.description}
      </p>
      <Link
        href={`/workspace/${shopId}/products/edit/${product.id}`}
        className="hover:underline"
      >
        Edit
      </Link>
    </div>
  );
}

export default ProductCard;
