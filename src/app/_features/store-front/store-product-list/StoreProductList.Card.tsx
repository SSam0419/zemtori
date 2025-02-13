import { ListCollapse } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/app/_shared/components/ui/badge";
import BlurFade from "@/app/_shared/components/ui/blur-fade";
import { Button } from "@/app/_shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_shared/components/ui/card";
import { TProductPricing } from "@/app/_shared/types/global-types";

import ShoppingCartButton from "../ShoppingCartButton";
import { ProductImage } from "./StoreProductList.Card.Image";
import { ProductTags } from "./StoreProductList.Card.Tags";

interface ProductCardProps {
  product: {
    base: {
      productId: string;
      productName: string;
      description: string;
      productImages: Array<{ imageId: string; imageUrl: string }>;
    };
    category: {
      categoryName: string;
    };
    tags: Array<{ tagId: string; tagName: string }>;
    productPricing: TProductPricing;
  };
  storeId: string;
  index: number;
}

export function ProductCard({ product, storeId, index }: ProductCardProps) {
  return (
    <BlurFade delay={0.25 + index * 0.01}>
      <Card className="relative flex h-full flex-col rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
        <Badge className="absolute -top-2.5 left-2 z-50">{product.category.categoryName}</Badge>
        <CardHeader className="flex-none">
          <CardTitle>{product.base.productName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="relative aspect-square w-full rounded-lg">
            <ProductImage images={product.base.productImages} priority={index < 4} />
          </div>

          <div className="min-h-[4rem] space-y-2 py-1">
            <div className="min-h-[1.5rem]">
              <ProductTags tags={product.tags} />
            </div>
            <p className="line-clamp-1 text-sm text-gray-500">{product.base.description}</p>
          </div>
        </CardContent>

        <CardFooter className="w-full flex-none">
          <div className="flex w-full items-center justify-between gap-2">
            <ShoppingCartButton
              storeId={storeId}
              productId={product.base.productId}
              productPricing={product.productPricing}
            />
            <Button className="w-full" variant="outline">
              <Link href={`/product/${product.base.productId}`}>
                <div className="flex w-full items-center gap-1">
                  <ListCollapse />
                  Details
                </div>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </BlurFade>
  );
}
