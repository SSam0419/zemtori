"use client";

import Image from "next/image";
import React from "react";

import { Button } from "@/app/_shared/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { ProductFormTypes } from "../types";

// Define the props for FinalStep
interface FinalStepProps {
  name: string;
  description: string;
  selectedTags: {
    id: string;
    tag: string;
  }[];
  selectedCategory: {
    id: string;
    category: string;
  };
  productPricing: ProductFormTypes.ProductVariant;
  previews: string[];
  onPrevious: () => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
}

function FinalStep({
  isLoading,
  name,
  description,
  selectedTags,
  selectedCategory,
  productPricing,
  previews,
  onPrevious,
  handleSubmit,
}: FinalStepProps) {
  return (
    <div className="rounded bg-white p-6 shadow-lg">
      <h3 className="w-full text-center text-xl font-semibold">Review and Submit</h3>

      <Separator className="my-4 border" />

      {/* Basic Product Info */}
      <div className="mb-4">
        <p className="py-1 text-lg font-semibold">Basic Product Info</p>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
      </div>

      {/* Classification */}
      <div className="mb-4">
        <p className="py-1 text-lg font-semibold">Classification</p>
        <p>
          <strong>Category ID:</strong> {selectedCategory.category}
        </p>
        <p>
          <strong>Tags:</strong> {selectedTags.map((t) => t.tag).join(", ")}
        </p>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <p className="py-1 text-lg font-semibold">Pricing</p>
        <p>
          <strong>With Variants: </strong> {productPricing.hasVariants ? "Yes" : "No"}
        </p>
        <div>
          {productPricing.hasVariants ? (
            <div>
              <strong>Variant Values:</strong>
              <ul>
                {productPricing.variants.map((variant, index) => (
                  <li key={index} className="my-2 border p-2">
                    <p>
                      Variants :{" "}
                      {variant.variantValues
                        .map((vv) => `[${vv.typeName} : ${vv.valueName}]`)
                        .join(", ")}
                    </p>
                    <p>Stock : {variant.stock}</p>
                    <p>Price : {variant.price}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p>
                <strong>Price:</strong> {productPricing.defaultPrice}
              </p>
              <p>
                <strong>Stock:</strong> {productPricing.defaultStock}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="mb-4">
        <p className="py-1 text-lg font-semibold">Uploaded Images</p>
        <div className="grid grid-cols-5 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative border-2 border-dashed p-1">
              <Image
                src={preview}
                alt={`Uploaded image ${index + 1}`}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>
        {previews.length === 0 && <p className="w-full">No Images Uploaded.</p>}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={onPrevious}>
          Back
        </Button>
        <Button
          onClick={async () => await handleSubmit()}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Submit Product
        </Button>
      </div>
    </div>
  );
}

export default FinalStep;
