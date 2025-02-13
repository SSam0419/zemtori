import React from "react";

import CreateProductPricingForm from "../form/product-pricing-form/CreateProductPricingForm";
import { Button } from "../ui/button";
import CreateActionButtonLayout from "./ActionButtonLayout";

export default function CreateProductPricingButton({
  content,
  successCallback,
}: {
  successCallback?: () => void;
  content?: React.ReactNode;
}) {
  return (
    <CreateActionButtonLayout
      content={
        content ? (
          content
        ) : (
          <Button variant="secondary" className="w-full" type="button">
            Add Product Pricing
          </Button>
        )
      }
      dialogTitle="New Pricing"
      FormComponent={CreateProductPricingForm}
      successCallback={successCallback}
    />
  );
}
