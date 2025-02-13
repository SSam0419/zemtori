import React from "react";

import MultiPageFormLayout from "@/app/_shared/components/layout/form-layout/MultiPageFormLayout";

function BasicProductInfoStep({
  name,
  setName,
  description,
  setDescription,
  handleSubmit,
}: {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <MultiPageFormLayout.FormLayout currentStep={0} onSubmit={handleSubmit}>
      <MultiPageFormLayout.FormInput
        formName="name"
        label="Product Name"
        placeholder="Product name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        isRequired={true}
      />
      <MultiPageFormLayout.FormTextarea
        formName="description"
        label="Product Description"
        placeholder="Product description"
        value={description}
        isRequired={true}
        onChange={(e) => setDescription(e.target.value)}
      />

      <MultiPageFormLayout.FormNavigation />
    </MultiPageFormLayout.FormLayout>
  );
}

export default BasicProductInfoStep;
