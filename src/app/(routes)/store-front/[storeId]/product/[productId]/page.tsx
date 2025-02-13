import Image from "next/image";

import { GetStoreProducts } from "@/app/_server/store-actions/get-store-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_shared/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/app/_shared/components/ui/carousel";

import CarouselButton from "./CarouselButton";
import PriceSection from "./PriceSection";

async function Page({ params }: { params: Promise<{ storeId: string; productId: string }> }) {
  const { storeId, productId } = await params;

  const data = await GetStoreProducts({
    storeId,
    productId,
  });

  if (!data.success) {
    throw new Error("Product not found");
  }

  const productDetails = data.payload.data[0];
  const productVariants = productDetails.productPricing.pricing;

  const variantMap = new Map<string, Set<string>>();
  // First pass: collect all variants into a Map with Sets
  productVariants.forEach((variant) => {
    variant.variantValues.forEach((value) => {
      if (!variantMap.has(value.variantTypeName)) {
        variantMap.set(value.variantTypeName, new Set([value.variantValueName]));
      } else {
        variantMap.get(value.variantTypeName)!.add(value.variantValueName);
      }
    });
  });
  // Convert Map to the desired array format
  const priceOptions: {
    typeName: string;
    valueNames: string[];
  }[] = Array.from(variantMap, ([typeName, valueSet]) => ({
    typeName,
    valueNames: Array.from(valueSet),
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{productDetails.base.productName}</CardTitle>
          <CardDescription>{productDetails.base.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:grid md:grid-cols-4">
            <Carousel className="relative w-full md:col-span-3">
              <CarouselContent>
                {productDetails.base.productImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="">
                      <Card>
                        <CardContent className="relative flex aspect-square items-center justify-center p-6">
                          <Image
                            src={img.imageUrl}
                            alt={`Product image ${img.imageId}`}
                            fill
                            className="flex h-full w-full items-center justify-center object-contain"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselButton />
            </Carousel>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-2">
                  <PriceSection priceOptions={priceOptions} productVariants={productVariants} />
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Page;
