"use client";
import { useUpdateCategoryMutation } from "@/app/_shared/hooks/mutations/useUpdateCategoryMutation";
import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useParams } from "next/navigation";
import { useState } from "react";
import * as FormLayout from "../../layout/form-layout/FormLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";

export function UpdateCategoryFormDialog({
  open, setOpen, onSuccess, category
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  category: {
    id: string;
    categoryName: string;
    categoryDescription: string;
    parentCategoryId:
    | string
    | null
    | undefined;
  };
}
) {
  return <Dialog
    open={open} onOpenChange={setOpen}
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Category</DialogTitle>
      </DialogHeader>
      <UpdateCategoryForm
        onSuccess={onSuccess}
        category={category}
      />
    </DialogContent>
  </Dialog>
}

function UpdateCategoryForm({
  onSuccess,
  category,
}: {
  onSuccess?: () => void;
  category: {
    id: string;
    categoryName: string;
    categoryDescription: string;
    parentCategoryId:
    | string
    | null
    | undefined;
  };
}) {
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const categoryQuery =
    useCategoryQuery(shopId);
  const updateCategoryMutation =
    useUpdateCategoryMutation();
  const isLoading =
    updateCategoryMutation.isPending ||
    categoryQuery.isLoading;

  const [formData, setFormData] =
    useState<{
      categoryName: string;
      categoryDescription: string;
      parentCategoryId:
      | string
      | undefined
      | null;
    }>({
      categoryName:
        category.categoryName,
      categoryDescription:
        category.categoryDescription,
      parentCategoryId:
        category.parentCategoryId,
    });

  return (
    <FormLayout.FormLayout
      onSubmit={async () => {
        if (!categoryQuery.data) {
          alert(
            "Error finding existing categories",
          );
          return;
        }

        if (
          categoryQuery.data
            .map(
              (cate) =>
                cate.categoryName,
            )
            .includes(
              formData.categoryName,
            )
        ) {
          alert(
            "Category name already exists",
          );
          return;
        }

        updateCategoryMutation.mutate(
          {
            formData: {
              ...formData,
              categoryId: category.id,
            },
          },
        );
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
            categoryName:
              e.target.value,
          }));
        }}
        placeholder="Category Name"
        isDisabled={isLoading}
      ></FormLayout.FormInput>
      <FormLayout.FormTextarea
        label="Description"
        formName="description"
        value={
          formData.categoryDescription
        }
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            categoryDescription:
              e.target.value,
          }));
        }}
        placeholder="Category Description"
        isDisabled={isLoading}
      ></FormLayout.FormTextarea>
      <FormLayout.FormSelect
        formName="parentCategoryId"
        value={
          formData.parentCategoryId ||
          undefined
        }
        options={
          categoryQuery.data
            ? [
              {
                value: "none",
                label: "None",
              },
              ...categoryQuery.data.map(
                (data) => ({
                  value: data.id,
                  label:
                    data.categoryName,
                }),
              ),
            ]
            : []
        }
        label="Parent Category (Optional)"
        onValueChange={(val) => {
          setFormData((prevData) => ({
            ...prevData,
            parentCategoryId:
              val === "none"
                ? undefined
                : val,
          }));
        }}
        isDisabled={isLoading}
      />

      <FormLayout.FormSubmitButton
        isDisabled={isLoading}
      />
    </FormLayout.FormLayout>
  );
}

export default UpdateCategoryForm;
