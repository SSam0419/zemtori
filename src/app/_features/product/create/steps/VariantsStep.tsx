import { X } from "lucide-react";
import React from "react";

import CreateVariantValueButton from "@/app/_shared/components/action-button/CreateVariantValueButton";
import MultiPageFormLayout from "@/app/_shared/components/layout/form-layout/MultiPageFormLayout";
import { Button } from "@/app/_shared/components/ui/button";
import { useCustomToast } from "@/app/_shared/hooks/useCustomToast";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { ProductFormTypes } from "../types";

function VariantsStep({
  onSubmit,
  onPrevious,
  productPricing,
  updateProductPricing,
  variantValues,
}: {
  variantValues: {
    id: string;
    variantValueName: string;
    variantTypeId: string;
    typeName: string;
  }[];
  onSubmit: () => void;
  onPrevious: () => void;
  productPricing: ProductFormTypes.ProductVariant;
  updateProductPricing: (data: ProductFormTypes.ProductVariant) => void;
}) {
  const { toastError } = useCustomToast();
  function validateVariants() {
    if (productPricing.hasVariants) {
      // must have more than 1 variant
      // each variants must have at least 1 variant value
      // each variant must have a price and stock
      // cannot have duplicate variant combinations
      if (productPricing.variants.length < 1) {
        return {
          valid: false,
          message: "Must have at least 1 variant",
        };
      }
      for (const variant of productPricing.variants) {
        if (variant.variantValues.length < 1) {
          return {
            valid: false,
            message: "Each variant must have at least 1 variant value",
          };
        }
        if (variant.price < 0) {
          return {
            valid: false,
            message: "Each variant must have a price",
          };
        }
        if (variant.stock < 0) {
          return {
            valid: false,
            message: "Each variant must have a stock",
          };
        }
      }
      const variantCombination = productPricing.variants
        .map((v) =>
          v.variantValues
            .map((vv) => vv.id)
            .sort()
            .join("-"),
        )
        .sort()
        .join(",");

      const uniqueVariantCombination = new Set(variantCombination.split(","));
      if (uniqueVariantCombination.size !== productPricing.variants.length) {
        return {
          valid: false,
          message: "Cannot have duplicate variant combinations",
        };
      }

      return {
        valid: true,
        message: "",
      };
    } else {
      // must have a default price and stock
      if (productPricing.defaultPrice < 0) {
        return {
          valid: false,
          message: "Must have a default price",
        };
      }
      if (productPricing.defaultStock < 0) {
        return {
          valid: false,
          message: "Must have a default stock",
        };
      }

      return {
        valid: true,
        message: "",
      };
    }
  }

  return (
    <MultiPageFormLayout.FormLayout
      currentStep={2}
      onSubmit={() => {
        const validation = validateVariants();
        if (!validation.valid) {
          return toastError(validation.message);
        }

        onSubmit();
      }}
    >
      <MultiPageFormLayout.FormSelect
        formName="hasVariants"
        label="Does this product have variants?"
        options={[
          {
            value: "yes",
            label: "Yes",
          },
          { value: "no", label: "No" },
        ]}
        onValueChange={(val) => {
          updateProductPricing({
            ...productPricing,
            hasVariants: val === "yes",
          });
        }}
        value={productPricing.hasVariants ? "yes" : "no"}
      />
      {productPricing.hasVariants && (
        <CreateVariantValueButton
          content={
            <Button type={"button"} variant="secondary">
              Create New Variant
            </Button>
          }
        />
      )}
      <Separator className="w-full border" />

      {!productPricing.hasVariants && (
        <>
          <MultiPageFormLayout.FormInput
            formName="defaultPrice"
            label="Default Price"
            value={productPricing.defaultPrice.toString()}
            onChange={(e) =>
              updateProductPricing({
                ...productPricing,
                defaultPrice: Number(e.target.value),
              })
            }
            placeholder="Default Price"
          />
          <MultiPageFormLayout.FormInput
            formName="defaultStock"
            label="Default Stock"
            value={productPricing.defaultStock.toString()}
            onChange={(e) =>
              updateProductPricing({
                ...productPricing,
                defaultStock: Number(e.target.value),
              })
            }
            placeholder="Default Stock"
          />
        </>
      )}
      {productPricing.hasVariants && (
        <div className="grid w-full grid-cols-12 items-center gap-2">
          <p className="col-span-7">Variant Combination</p>
          <p className="col-span-2">Price</p>
          <p className="col-span-2">Stock</p>
          <p className="col-span-1 flex items-center justify-center">Actions</p>
        </div>
      )}
      {productPricing.hasVariants &&
        productPricing.variants.map((variant, index) => (
          <div key={index} className="flex w-full items-center justify-center">
            <div className="grid w-full grid-cols-12 items-center gap-2">
              <div className="col-span-7">
                <MultiPageFormLayout.FormMultiSelect
                  formName={`variants[${index}].variantValueIds`}
                  options={
                    variantValues.map((v) => ({
                      label: `${v.typeName} : ${v.variantValueName}`,
                      value: `${v.id}-%-${v.variantTypeId}`,
                      disabled:
                        variant.variantValues.find((vv) => vv.typeId === v.variantTypeId) &&
                        v.id !==
                          variant.variantValues.find((vv) => vv.typeId === v.variantTypeId)?.id,
                    })) || []
                  }
                  value={variant.variantValues.map((v) => ({
                    label: `${v.typeName} : ${v.valueName}`,
                    value: `${v.id}-%-${v.typeId}`,
                  }))}
                  onValueChange={(val) => {
                    const typeIds = val.map((v) => v.value.split("-%-")[1]);
                    val = val.slice(0, typeIds.length);
                    if (val.length !== typeIds.length) {
                      console.log("Duplicate values found");
                      return alert("Duplicate values found");
                    }

                    const updatedVariantValues = val.map((v) => {
                      const [id, typeId] = v.value.split("-%-");
                      return {
                        id,
                        typeId,
                        typeName: variantValues.find((vv) => vv.id === id)?.typeName || "",
                        valueName: variantValues.find((vv) => vv.id === id)?.variantValueName || "",
                      };
                    });

                    updateProductPricing({
                      ...productPricing,
                      variants: productPricing.variants.map((v, i) =>
                        i === index
                          ? {
                              ...v,
                              variantValues: updatedVariantValues,
                            }
                          : v,
                      ),
                    });
                  }}
                  placeholder="Select Variant Values"
                />
              </div>

              <div className="col-span-2">
                <MultiPageFormLayout.FormInput
                  formName={`variants[${index}].price`}
                  value={variant.price.toString()} // Fixed the reference
                  onChange={(e) =>
                    updateProductPricing({
                      ...productPricing,
                      variants: productPricing.variants.map((v, i) =>
                        i === index
                          ? {
                              ...v,
                              price: Number(e.target.value),
                            }
                          : v,
                      ),
                    })
                  }
                  placeholder="Price"
                />
              </div>

              <div className="col-span-2">
                <MultiPageFormLayout.FormInput
                  formName={`variants[${index}].stock`}
                  value={variant.stock.toString()} // Fixed the reference
                  onChange={(e) =>
                    updateProductPricing({
                      ...productPricing,
                      variants: productPricing.variants.map((v, i) =>
                        i === index
                          ? {
                              ...v,
                              stock: Number(e.target.value),
                            }
                          : v,
                      ),
                    })
                  }
                  placeholder="Stock"
                />
              </div>

              <div className="col-span-1 flex items-center justify-center">
                <Button
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    updateProductPricing({
                      ...productPricing,
                      variants: productPricing.variants.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}

      {productPricing.hasVariants && (
        <Button
          type="button"
          onClick={() => {
            updateProductPricing({
              ...productPricing,
              variants: [
                ...productPricing.variants,
                {
                  variantValues: [], // Empty array for the new variant
                  price: 0,
                  stock: 0,
                },
              ],
            });
          }}
        >
          New Variant Option
        </Button>
      )}

      <Separator className="w-full border" />

      <MultiPageFormLayout.FormNavigation onPrevious={onPrevious} />
    </MultiPageFormLayout.FormLayout>
  );
}

export default VariantsStep;
