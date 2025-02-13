"use client";
import React, { useMemo, useState } from "react";

import { Label } from "@/app/_shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_shared/components/ui/select";
import { TProductPricingDetails } from "@/app/_shared/types/global-types";

interface PriceOption {
  typeName: string;
  valueNames: string[];
}

interface SelectedPrice {
  selectedType: string;
  selectedValue: string;
}

interface PriceSectionProps {
  priceOptions: PriceOption[];
  productVariants: TProductPricingDetails[];
}

function PriceSection({ priceOptions, productVariants }: PriceSectionProps) {
  const [selectedPricing, setSelectedPricing] = useState<SelectedPrice[]>([]);

  const currentPrice = useMemo(() => {
    if (selectedPricing.length === 0) return null;

    return productVariants.find((variant) => {
      if (variant.variantValues.length !== selectedPricing.length) return false;

      return variant.variantValues.every((value) =>
        selectedPricing.some(
          (selected) =>
            selected.selectedType === value.variantTypeName &&
            selected.selectedValue === value.variantValueName,
        ),
      );
    });
  }, [selectedPricing, productVariants]);

  function handleValueChange(value: string, optionType: string) {
    setSelectedPricing((prev) => {
      if (value === "none") {
        return prev.filter((selected) => selected.selectedType !== optionType);
      }

      const newSelected = prev.filter((selected) => selected.selectedType !== optionType);
      return [...newSelected, { selectedType: optionType, selectedValue: value }];
    });
  }

  return (
    <div className="space-y-4">
      {priceOptions.map((option) => (
        <div key={option.typeName} className="flex flex-col gap-2">
          <Label>{option.typeName}</Label>
          <Select
            onValueChange={(value) => handleValueChange(value, option.typeName)}
            value={
              selectedPricing.find((sp) => sp.selectedType === option.typeName)?.selectedValue ||
              "none"
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="select .." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {option.valueNames.map((valueName) => (
                <SelectItem key={valueName} value={valueName}>
                  {valueName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Label>Price</Label>
        <Label>{currentPrice?.price || "N/A"}</Label>
      </div>
    </div>
  );
}

export default PriceSection;
