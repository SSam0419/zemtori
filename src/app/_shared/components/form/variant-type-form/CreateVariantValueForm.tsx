"use client";
import { useVariantTypeQuery } from "@/app/_shared/hooks/queries/useVariantTypeQuery";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import * as FormLayout from "../../layout/form-layout/FormLayout";
import { useCreateVariantValueMutation } from "@/app/_shared/hooks/mutations/useCreateVariantValueMutation";
import CreateVariantTypeButton from "@/app/_shared/components/action-button/CreateVariantTypeButton";
import { useVariantValueQuery } from "@/app/_shared/hooks/queries/useVariantValueQuery";
import TextBoard from "@/app/_shared/components/TextBoard";
import { Button } from "../../ui/button";

function CreateVariantValueForm({ onSuccess }: { onSuccess?: () => void }) {
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const variantTypeQuery = useVariantTypeQuery(shopId);
  const variantValueQuery = useVariantValueQuery(shopId);
  const [selectedVariantType, setSelectedVariantType] = useState<string>("");
  const [newVariantValue, setNewVariantValue] = useState<string>("");
  const variantValueMutation = useCreateVariantValueMutation(onSuccess);

  const isDisabled =
    variantTypeQuery.isLoading ||
    variantValueMutation.isPending ||
    variantValueQuery.isLoading ||
    (variantTypeQuery.data && variantTypeQuery.data.length === 0);

  return (
    <FormLayout.FormLayout
      onSubmit={async () => {
        if (selectedVariantType === "") {
          return alert("Please select a variant type");
        }

        if (!variantValueQuery.data) {
          alert("Error finding existing variant values");
          return;
        }

        if (
          variantValueQuery.data
            .map((v) => v.variantValueName.toLowerCase())
            .includes(newVariantValue.toLowerCase())
        ) {
          return alert("Variant Value name already exists");
        }

        await variantValueMutation.mutate({
          variantTypeId: selectedVariantType,
          variantValueName: newVariantValue,
        });
      }}
    >
      {variantTypeQuery.data && variantTypeQuery.data.length === 0 && (
        <TextBoard type="error">
          You have to create at least one variant type before creating a variant value
        </TextBoard>
      )}

      <FormLayout.FormSelect
        action={
          <CreateVariantTypeButton
            content={
              <Button type="button" className="w-full">
                New Type
              </Button>
            }
          />
        }
        label="Variant Type"
        options={
          variantTypeQuery.data?.map((variantType) => ({
            label: variantType.variantTypeName,
            value: variantType.id,
          })) || []
        }
        value={selectedVariantType}
        formName="variantType"
        onValueChange={setSelectedVariantType}
        isDisabled={isDisabled}
      />
      <FormLayout.FormInput
        label="Variant Value"
        value={newVariantValue}
        formName="variantValue"
        onChange={(e) => setNewVariantValue(e.target.value)}
        placeholder="Enter variant value"
        isDisabled={isDisabled}
      />
      {variantValueMutation.isError && (
        <TextBoard type="error">Something went wrong. Please try again later</TextBoard>
      )}
      <FormLayout.FormSubmitButton isDisabled={isDisabled} />
    </FormLayout.FormLayout>
  );
}

export default CreateVariantValueForm;
