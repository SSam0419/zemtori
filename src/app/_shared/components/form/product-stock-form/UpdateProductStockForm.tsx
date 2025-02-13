"use client";

import React, { useState } from "react";

import { useUpdateProductStock } from "@/app/_shared/hooks/mutations/useUpdateProductStock";

import * as FormLayout from "../../layout/form-layout/FormLayout";

function UpdateProductStockForm({
  successCallback,
  stock,
  pricingId,
}: {
  pricingId: string;
  stock: number;

  successCallback?: () => void;
}) {
  const mutation = useUpdateProductStock(successCallback);
  const [newStock, setNewStock] = useState(stock);
  return (
    <FormLayout.FormLayout
      onSubmit={() => {
        mutation.mutate({
          pricingId,
          stock: newStock,
        });
      }}
    >
      <p className="text-sm text-muted-foreground">Adjusting stock from {stock} :</p>
      <FormLayout.FormInput
        formName="stock"
        onChange={(e) => setNewStock(Number(e.target.value))}
        placeholder="adjust stock"
        value={newStock.toString()}
        type="number"
      />
      <FormLayout.FormSubmitButton text="Adjust" isLoading={mutation.isPending} />
    </FormLayout.FormLayout>
  );
}

export default UpdateProductStockForm;
