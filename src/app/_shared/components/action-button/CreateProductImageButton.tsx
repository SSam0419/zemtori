import React from "react";

import CreateProductImageForm from "../form/product-image-form/CreateProductImageForm";
import { Button } from "../ui/button";
import CreateActionButtonLayout from "./ActionButtonLayout";

function CreateProductImageButton({ content }: { content?: React.ReactNode }) {
  return (
    <CreateActionButtonLayout
      FormComponent={CreateProductImageForm}
      content={
        content ? (
          content
        ) : (
          <Button variant="secondary" className="w-full" type="button">
            Upload Product Image
          </Button>
        )
      }
      dialogTitle="New Product Image"
    />
  );
}

export default CreateProductImageButton;
