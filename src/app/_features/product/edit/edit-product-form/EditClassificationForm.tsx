"use client";
import { useParams } from "next/navigation";
import React from "react";

import * as FormLayout from "@/app/_shared/components/layout/form-layout/FormLayout";
import { Badge } from "@/app/_shared/components/ui/badge";
import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useTagsQuery } from "@/app/_shared/hooks/queries/useTagsQuery";

import { useUpdateClassificationMutation } from "../hooks/useUpdateClassificationMutation";
import EditFormLayout from "../layout/EditFormLayout";

function EditClassificationForm({
  tags,
  category,
  canProductBeEdited,
}: {
  canProductBeEdited: boolean;
  tags: { tagId: string; tagName: string }[];
  category: { categoryId: string; categoryName: string };
}) {
  const [selectedTags, setSelectedTags] =
    React.useState<{ tagId: string; tagName: string }[]>(tags);
  const [selectedCategory, setSelectedCategory] = React.useState<{
    categoryId: string;
    categoryName: string;
  }>(category);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const { shopId } = useParams<{ shopId: string }>();
  const categoryQuery = useCategoryQuery(shopId);
  const tagQuery = useTagsQuery();
  const classificationMutation = useUpdateClassificationMutation();
  const { productId } = useParams<{ productId: string }>();

  return (
    <EditFormLayout
      canProductBeEdited={canProductBeEdited}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      EditComponent={
        <FormLayout.FormLayout
          onSubmit={async () => {
            await classificationMutation.mutate({
              categoryId: selectedCategory.categoryId,
              tagIds: selectedTags.map((t) => t.tagId),
              productId,
            });
            setIsEditing(false);
          }}
        >
          <FormLayout.FormSelect
            value={selectedCategory.categoryId}
            onValueChange={(val) => {
              if (categoryQuery.data) {
                const category = categoryQuery.data.find((c) => c.id === val);
                if (category) {
                  setSelectedCategory({
                    categoryId: category.id,
                    categoryName: category.categoryName,
                  });
                }
              }
            }}
            label="Category"
            formName="category"
            options={
              categoryQuery.data?.map((c) => ({
                value: c.id,
                label: c.categoryName,
              })) || []
            }
          />

          <FormLayout.FormMultiSelect
            value={selectedTags.map((t) => ({ label: t.tagName, value: t.tagId }))}
            onValueChange={(val) => {
              if (tagQuery.data) {
                setSelectedTags(
                  val.map((v) => {
                    const tag = tagQuery.data?.find((t) => t.id === v.value);
                    if (tag) {
                      return { tagId: tag.id, tagName: tag.tagName };
                    }
                    return { tagId: "", tagName: "" };
                  }),
                );
              }
            }}
            label="Tags"
            formName="tags"
            options={
              tagQuery.data?.map((t) => ({
                value: t.id,
                label: t.tagName,
              })) || []
            }
            placeholder="Select Tags"
          />

          <FormLayout.FormSubmitButton text="Save" isLoading={classificationMutation.isPending} />
        </FormLayout.FormLayout>
      }
      ViewComponent={
        <div>
          <p className="text-xl font-semibold">Category</p>
          <p className="">{selectedCategory.categoryName}</p>
          <p className="text-xl font-semibold">Tags</p>
          <div className="space-x-2">
            {selectedTags.map((t) => {
              return <Badge key={t.tagId}>{t.tagName}</Badge>;
            })}
          </div>
        </div>
      }
    />
  );
}

export default EditClassificationForm;
