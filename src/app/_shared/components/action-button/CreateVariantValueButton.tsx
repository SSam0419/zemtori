import React from "react";
import CreateVariantValueForm from "../form/variant-type-form/CreateVariantValueForm";
import CreateActionButtonLayout from "./ActionButtonLayout";
import { Button } from "../ui/button";

export default function CreateVariantValueButton({
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
            Create Variant Value
          </Button>
        )
      }
      dialogTitle="New Variant Value"
      FormComponent={
        CreateVariantValueForm
      }
    />
  );
}
