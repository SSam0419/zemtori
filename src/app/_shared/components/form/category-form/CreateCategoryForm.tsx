"use client";
import React, { useState } from "react";
import * as FormLayout from "../../layout/form-layout/FormLayout";
import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useCreateCategoryMutation } from "@/app/_shared/hooks/mutations/useCreateCategoryMutation";
import { useParams } from "next/navigation";

function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { shopId } = useParams<{ shopId: string }>();
  const categoryQuery = useCategoryQuery(shopId);
  const createCategoryMutation = useCreateCategoryMutation();
  const isLoading = createCategoryMutation.isPending || categoryQuery.isLoading;

  const [formData, setFormData] = useState<{
    categoryName: string;
    description: string;
    parentCategoryId: string | undefined;
  }>({
    categoryName: "",
    description: "",
    parentCategoryId: undefined,
  });

  return (
    <FormLayout.FormLayout
      onSubmit={async () => {
        if (!categoryQuery.data) {
          alert("Error finding existing categories");
          return;
        }

        if (
          categoryQuery.data
            .map((cate) => cate.categoryName)
            .includes(formData.categoryName)
        ) {
          alert("Category name already exists");
          return;
        }

        await createCategoryMutation.mutate({ shopId, formData });
        if (onSuccess) onSuccess();
      }}
    >
      <FormLayout.FormInput
        label="Category Name"
        formName="categoryName"
        value={formData.categoryName}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            categoryName: e.target.value,
          }));
        }}
        placeholder="Category Name"
        isDisabled={isLoading}
      ></FormLayout.FormInput>
      <FormLayout.FormTextarea
        formName="description"
        value={formData.description}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            description: e.target.value,
          }));
        }}
        placeholder="Category Description"
        isDisabled={isLoading}
      ></FormLayout.FormTextarea>
      <FormLayout.FormSelect
        formName="parentCategoryId"
        value={formData.parentCategoryId}
        options={
          categoryQuery.data
            ? [
                {
                  value: "none",
                  label: "None",
                },
                ...categoryQuery.data.map((data) => ({
                  value: data.id,
                  label: data.categoryName,
                })),
              ]
            : []
        }
        label="Parent Category (Optional)"
        onValueChange={(val) => {
          setFormData((prevData) => ({
            ...prevData,
            parentCategoryId: val === "none" ? undefined : val,
          }));
        }}
        isDisabled={isLoading}
      />

      <FormLayout.FormSubmitButton isDisabled={isLoading} />
    </FormLayout.FormLayout>
  );
}

export default CreateCategoryForm;
