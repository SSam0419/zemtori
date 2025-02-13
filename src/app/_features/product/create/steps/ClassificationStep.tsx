"use client";

import React from "react";

import CreateCategoryButton from "@/app/_shared/components/action-button/CreateCategoryButton";
import CreateTagButton from "@/app/_shared/components/action-button/CreateTagButton";
import MultiPageFormLayout from "@/app/_shared/components/layout/form-layout/MultiPageFormLayout";
import { useCustomToast } from "@/app/_shared/hooks/useCustomToast";

function ClassificationStep({
  categoryId,
  selectedTags,
  handleSubmit,
  onPrevious,
  categories,
  tags,
  updateSelectedCategory,
  updateSelectedTags,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  onPrevious: () => void;
  categories: {
    id: string;
    categoryName: string;
    description: string;
    parentCategoryId: string | null;
  }[];
  tags: {
    id: string;
    tagName: string;
  }[];
  categoryId: string;
  selectedTags: {
    id: string;
    tag: string;
  }[];
  updateSelectedTags: (
    selectedTags: {
      id: string;
      tag: string;
    }[],
  ) => void;
  updateSelectedCategory: (id: string) => void;
}) {
  const { toastError } = useCustomToast();

  return (
    <MultiPageFormLayout.FormLayout
      currentStep={1}
      onSubmit={(e) => {
        //check if the form is valid
        if (!categoryId) {
          return toastError("Please select a category");
        }
        return handleSubmit(e);
      }}
    >
      {/* select category */}
      <MultiPageFormLayout.FormSelect
        formName="category"
        label="Category"
        onValueChange={(val) => updateSelectedCategory(val)}
        options={
          (categories &&
            categories.map((cate) => ({
              value: cate.id,
              label: cate.categoryName,
            }))) ||
          []
        }
        action={<CreateCategoryButton />}
        value={categoryId}
      />
      {/* select tags */}
      <MultiPageFormLayout.FormMultiSelect
        action={<CreateTagButton />}
        formName="tags"
        label="Tags (Optional)"
        onValueChange={(val) =>
          updateSelectedTags(
            val.map((t) => ({
              id: t.value,
              tag: t.label,
            })),
          )
        }
        options={
          (tags &&
            tags.map((tag) => ({
              value: tag.id,
              label: tag.tagName,
            }))) ||
          []
        }
        value={selectedTags.map((t) => ({
          value: t.id,
          label: t.tag,
        }))}
        placeholder="Select tags"
      />

      <MultiPageFormLayout.FormNavigation onPrevious={onPrevious} />
    </MultiPageFormLayout.FormLayout>
  );
}

export default ClassificationStep;
