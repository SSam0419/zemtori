"use client";
import { useParams } from "next/navigation";
import React from "react";

import { revalidateEditProductPage } from "@/app/_server/revalidate-paths";
import { useCreateProductPricingMutation } from "@/app/_shared/hooks/mutations/useCreateProductPricingMutation";
import { useProductPricingQuery } from "@/app/_shared/hooks/queries/useProductPricingQuery";
import { useVariantValueQuery } from "@/app/_shared/hooks/queries/useVariantValueQuery";

import CreateVariantValueButton from "../../action-button/CreateVariantValueButton";
import Alert from "../../Alerts";
import * as FormLayout from "../../layout/form-layout/FormLayout";
import { Button } from "../../ui/button";

function CreateProductPricingForm({
  onSuccess,
  productId,
}: {
  productId?: string;
  onSuccess?: () => void;
}) {
  const params = useParams<{ productId: string; shopId: string }>();
  const resolvedProductId = productId || params.productId;

  const createProductPricingMutation = useCreateProductPricingMutation(revalidateEditProductPage);
  const variantValueQuery = useVariantValueQuery();
  const productPricingQuery = useProductPricingQuery({ productId: resolvedProductId });

  const variantValueOptions = variantValueQuery.data || [];
  const [selectVariantValue, setSelectVariantValue] = React.useState<
    | {
        variantValueId: string;
      }[]
    | undefined
  >(undefined);
  const [isDefault, setIsDefault] = React.useState<boolean>(false);
  const [price, setPrice] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const selectedVariantOptions: { value: string; label: string }[] =
    selectVariantValue?.map((v) => {
      const option = variantValueOptions.find((o) => o.id === v.variantValueId);
      return { value: v.variantValueId, label: `${option?.typeName}:${option?.variantValueName}` };
    }) || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //check if the pricing is valid
    if (!isDefault) {
      const currentPricing = productPricingQuery.data;
      if (!currentPricing) {
        return;
      }

      setErrorMessages((prev) =>
        prev.filter((msg) => msg !== "Duplicate variant types are not allowed"),
      );
      setErrorMessages((prev) => prev.filter((msg) => msg !== "Duplicate pricing is not allowed"));

      //no duplicate types
      const currentTypeNames = variantValueOptions
        .filter(
          (option) => selectVariantValue?.map((v) => v.variantValueId).includes(option.id) || false,
        )
        .map((pricing) => pricing.typeName);
      if (new Set(currentTypeNames).size !== currentTypeNames.length) {
        setErrorMessages((prev) => [...prev, "Duplicate variant types are not allowed"]);

        return;
      }

      //no duplicate pricing
      const currentPricingVariants = currentPricing
        .map((pricing) => pricing.variantValues)
        .map((pricing) => pricing.map((pricing) => pricing.variantValueId));
      for (const existingPricing of currentPricingVariants) {
        if (
          existingPricing.length === selectVariantValue?.length &&
          existingPricing.every((value) =>
            selectVariantValue?.some((v) => v.variantValueId === value),
          )
        ) {
          setErrorMessages((prev) => [...prev, "Duplicate pricing is not allowed"]);
          return;
        }
      }
    }

    await createProductPricingMutation.mutate({
      productId: resolvedProductId,
      pricingData: {
        price: Number(price),
        stock: Number(stock),
        variants: selectVariantValue || [],
        isDefault: isDefault,
      },
    });

    if (onSuccess) onSuccess();
  }

  const isDisabled = createProductPricingMutation.isPending;

  if (!resolvedProductId) {
    return <div>Product ID is required</div>;
  }
  return (
    <FormLayout.FormLayout onSubmit={handleSubmit} isDisabled={isDisabled}>
      <FormLayout.FormSelect
        formName="mode"
        options={[
          { label: "Default", value: "default" },
          { label: "With Variants", value: "with-variants" },
        ]}
        onValueChange={(val) => {
          if (val === "default") {
            setIsDefault(true);
          } else if (val === "with-variants") {
            setIsDefault(false);
          }
        }}
        value={isDefault ? "default" : "with-variants"}
      />

      {!isDefault && (
        <FormLayout.FormMultiSelect
          options={variantValueOptions.map((option) => ({
            label: `${option.typeName}:${option.variantValueName}`,
            value: option.id,
          }))}
          formName="variantValueIds"
          label="Variant Values"
          isRequired
          onValueChange={(value) =>
            setSelectVariantValue(value.map((v) => ({ variantValueId: v.value })))
          }
          placeholder="Select Variant Values"
          value={selectedVariantOptions}
          action={
            <CreateVariantValueButton
              content={
                <Button type="button" variant="outline">
                  New Variant
                </Button>
              }
            />
          }
        />
      )}

      <FormLayout.FormInput
        label="Price"
        formName="price"
        type="number"
        placeholder="Price"
        isRequired
        value={price}
        onChange={(e) => {
          {
            setErrorMessages((prev) =>
              prev.filter(
                (msg) => msg !== "Price cannot be negative" && msg !== "Price must be a number",
              ),
            );
            const num = Number(e.target.value);
            if (num < 0) {
              setErrorMessages((prev) => [...prev, "Price cannot be negative"]);
            } else if (isNaN(num)) {
              setErrorMessages((prev) => [...prev, "Price must be a number"]);
            } else {
              setPrice(e.target.value);
            }
          }
        }}
      />
      <FormLayout.FormInput
        label="stock"
        formName="stock"
        type="number"
        placeholder="stock"
        isRequired
        value={stock}
        onChange={(e) => {
          {
            setErrorMessages((prev) =>
              prev.filter(
                (msg) => msg !== "stock cannot be negative" && msg !== "stock must be a number",
              ),
            );

            const num = Number(e.target.value);
            if (num < 0) {
              setErrorMessages((prev) => [...prev, "stock cannot be negative"]);
            } else if (isNaN(num)) {
              setErrorMessages((prev) => [...prev, "stock must be a number"]);
            } else {
              setStock(e.target.value);
            }
          }
        }}
      />

      {errorMessages.length > 0 &&
        errorMessages.map((msg, index) => <Alert key={index} variant="danger" message={msg} />)}

      <FormLayout.FormSubmitButton text="Add Product Pricing" />
    </FormLayout.FormLayout>
  );
}
export default CreateProductPricingForm;
