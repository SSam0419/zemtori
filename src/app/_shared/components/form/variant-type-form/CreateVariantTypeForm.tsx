"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import { useCreateVariantTypeMutation } from "@/app/_shared/hooks/mutations/useCreateVariantTypeMutation";
import { useVariantTypeQuery } from "@/app/_shared/hooks/queries/useVariantTypeQuery";

import * as FormLayout from "../../layout/form-layout/FormLayout";

function CreateVariantTypeForm({ onSuccess }: { onSuccess?: () => void }) {
  const { shopId } = useParams<{ shopId: string }>();
  const variantTypeQuery = useVariantTypeQuery(shopId);
  const variantTypeMutation = useCreateVariantTypeMutation(onSuccess);
  const [variantTypeName, setVariantTypeName] = useState<string>("");

  return (
    <FormLayout.FormLayout
      onSubmit={async () => {
        if (!variantTypeQuery.data) {
          alert("Error finding existing variant types");
          return;
        }

        if (
          variantTypeQuery.data
            .map((t) => t.variantTypeName.toLowerCase())
            .includes(variantTypeName.toLowerCase())
        ) {
          return alert("Variant Type name already exists");
        }

        await variantTypeMutation.mutate({
          shopId,
          variantTypeName,
        });
      }}
    >
      <FormLayout.FormInput
        label="Variant Type Name"
        formName="variantTypeName"
        placeholder="Variant Type Name"
        value={variantTypeName}
        onChange={(e) => setVariantTypeName(e.target.value)}
        isDisabled={variantTypeQuery.isLoading || variantTypeMutation.isPending}
      />
      {variantTypeMutation.isError && <p>{"Something went wrong!"}</p>}
      <FormLayout.FormSubmitButton
        isDisabled={variantTypeQuery.isLoading || variantTypeMutation.isPending}
      />
    </FormLayout.FormLayout>
  );
}

export default CreateVariantTypeForm;
