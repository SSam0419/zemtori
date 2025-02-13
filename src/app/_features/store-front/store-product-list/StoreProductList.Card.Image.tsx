import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_shared/components/ui/carousel";

interface ProductImage {
  imageId: string;
  imageUrl: string;
}

interface ProductImageProps {
  images: ProductImage[];
  priority?: boolean;
}

export function ProductImage({ images, priority }: ProductImageProps) {
  if (images.length === 0) {
    return (
      <Carousel className="h-full w-full">
        <CarouselContent>
          <CarouselItem className="relative aspect-square">
            <ImageIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    );
  }

  return (
    <Carousel className="h-full w-full max-w-xs">
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem
            key={img.imageId}
            className="relative flex aspect-square items-center justify-center"
          >
            <Image
              src={img.imageUrl}
              alt={`Product image ${img.imageId}`}
              fill
              className="flex h-full w-full items-center justify-center object-contain"
              priority={priority}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <div className="relative flex h-0 w-full items-center justify-between">
          <CarouselPrevious className="absolute -top-6 left-1" />
          <CarouselNext className="absolute -top-6 right-1" />
        </div>
      )}
    </Carousel>
  );
}
