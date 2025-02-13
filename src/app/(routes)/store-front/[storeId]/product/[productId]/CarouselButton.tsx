"use client";
import React from "react";

import { Button } from "@/app/_shared/components/ui/button";
import { useCarousel } from "@/app/_shared/components/ui/carousel";

export default function CarouselButton() {
  const { scrollNext, scrollPrev } = useCarousel();
  return (
    <div className="flex justify-between py-1">
      <Button type="button" onClick={scrollPrev} variant="outline" size="icon">
        {"<"}
      </Button>
      <Button type="button" onClick={scrollNext} variant="outline" size="icon">
        {">"}
      </Button>
    </div>
  );
}
