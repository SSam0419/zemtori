"use client";

import UpdateProductStockForm from "../form/product-stock-form/UpdateProductStockForm";
import { Button } from "../ui/button";
import CreateActionButtonLayout from "./ActionButtonLayout";

export function UpdateStockButton({
  stock,
  pricingId,
  content,
}: {
  stock: number;
  pricingId: string;
  content?: React.ReactNode;
}) {
  return (
    <CreateActionButtonLayout
      content={
        content ? (
          content
        ) : (
          <Button variant="secondary" className="w-full" type="button">
            Update Stock
          </Button>
        )
      }
      dialogTitle="New Tag"
      FormComponent={UpdateProductStockForm}
      formProps={{ pricingId, stock }}
    />
  );
}
