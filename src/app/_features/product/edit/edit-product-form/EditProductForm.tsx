"use client";
import { useParams } from "next/navigation";
import React from "react";

import * as FormLayout from "@/app/_shared/components/layout/form-layout/FormLayout";
import { TProductStatus } from "@/app/_shared/types/global-types";

import { useUpdateProductMutation } from "../hooks/useUpdateProductMutation";
import EditFormLayout from "../layout/EditFormLayout";

function EditProductForm({
  productName,
  productDescription,
  productStatus,
  canProductBeEdited,
}: {
  canProductBeEdited: boolean;
  productName: string;
  productDescription: string;
  productStatus: TProductStatus;
}) {
  const [editProductName, setEditProductName] = React.useState(productName);
  const [editProductDescription, setEditProductDescription] = React.useState(productDescription);
  const [editProductStatus] = React.useState<TProductStatus>(productStatus);
  const [isEditing, setIsEditing] = React.useState(false);
  const productMutation = useUpdateProductMutation();
  const { productId } = useParams<{ productId: string }>();
  return (
    <EditFormLayout
      canProductBeEdited={canProductBeEdited}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      EditComponent={
        <FormLayout.FormLayout
          onSubmit={async () => {
            await productMutation.mutate({
              productId: productId,
              productName: editProductName,
              productDescription: editProductDescription,
              productStatus: editProductStatus,
            });

            setIsEditing(false);
          }}
        >
          <FormLayout.FormInput
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
            label="Product Name"
            placeholder="Product Name"
            formName="productName"
          />
          <FormLayout.FormTextarea
            value={editProductDescription}
            onChange={(e) => setEditProductDescription(e.target.value)}
            label="Product Description"
            placeholder="Product Description"
            formName="productDescription"
          />
          <FormLayout.FormSubmitButton text="Save Changes" />
        </FormLayout.FormLayout>
      }
      ViewComponent={
        <>
          <p className="text-3xl font-semibold">{editProductName}</p>
          <p className="text-muted-foreground">{editProductDescription}</p>
        </>
      }
    />
  );
}

export default EditProductForm;
