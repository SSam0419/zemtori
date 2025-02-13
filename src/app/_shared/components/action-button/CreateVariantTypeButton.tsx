import React from "react";
import CreateVariantTypeForm from "../form/variant-type-form/CreateVariantTypeForm";
import CreateActionButtonLayout from "./ActionButtonLayout";
import { Button } from "../ui/button";

export default function CreateVariantTypeButton({
  content,
}: {
  content?: React.ReactNode;
}) {
  return (
    <CreateActionButtonLayout
      content={
        content ? (
          content
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            type="button"
          >
            Create Variant Type
          </Button>
        )
      }
      dialogTitle="New Variant Type"
      FormComponent={
        CreateVariantTypeForm
      }
    />
  );
}
