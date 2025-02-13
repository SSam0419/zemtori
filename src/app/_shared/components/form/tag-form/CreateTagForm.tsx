"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import { useCreateTagMutation } from "@/app/_shared/hooks/mutations/useCreateTagMutation";
import { useTagsQuery } from "@/app/_shared/hooks/queries/useTagsQuery";

import * as FormLayout from "../../layout/form-layout/FormLayout";

function CreateTagForm({ onSuccess }: { onSuccess?: () => void }) {
  const { shopId } = useParams<{ shopId: string }>();
  const tagQuery = useTagsQuery();
  const createTagMutation = useCreateTagMutation();

  const isLoading = createTagMutation.isPending || tagQuery.isLoading;

  const [formData, setFormData] = useState<{
    tagName: string;
    description: string;
  }>({
    tagName: "",
    description: "",
  });

  return (
    <FormLayout.FormLayout
      onSubmit={async () => {
        if (!tagQuery.data) {
          alert("Error finding existing tags");
          return;
        }

        if (tagQuery.data.map((tag) => tag.tagName).includes(formData.tagName)) {
          alert("Tag name already exists");
          return;
        }

        await createTagMutation.mutate({ shopId, formData });
        if (onSuccess) onSuccess();
      }}
      isDisabled={isLoading}
    >
      <FormLayout.FormInput
        label="Tag Name"
        formName="tagName"
        value={formData.tagName}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            tagName: e.target.value,
          }));
        }}
        placeholder="Tag Name"
        isDisabled={isLoading}
      ></FormLayout.FormInput>
      <FormLayout.FormTextarea
        isDisabled={isLoading}
        formName="description"
        value={formData.description}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            description: e.target.value,
          }));
        }}
        placeholder="Tag Description"
      ></FormLayout.FormTextarea>

      <FormLayout.FormSubmitButton isDisabled={isLoading} />
    </FormLayout.FormLayout>
  );
}

export default CreateTagForm;
