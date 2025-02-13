"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

import { useCreateProductImageMutation } from "@/app/_shared/hooks/mutations/useCreateProductImageMutation";

import * as FormLayout from "../../layout/form-layout/FormLayout";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

function CreateProductImageForm({
  onSuccess,
  productId,
}: {
  productId?: string;
  onSuccess?: () => void;
}) {
  const params = useParams<{ productId: string }>();
  const resolvedProductId = productId || params.productId;
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const createProductImageMutation = useCreateProductImageMutation();

  if (!resolvedProductId) {
    return <div>Product ID is required</div>;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    //max size = 1MB because of the next js serverless function limit
    if (file && file.size > 1_000_000) {
      alert("Image size must be less than 1MB");
      return;
    }

    if (file) {
      setImageFile(file);
    }
  }

  function handleRemoveImage() {
    setImageFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a valid image");
      return;
    }
    await createProductImageMutation.mutate({
      imageFile: imageFile,
      productId: resolvedProductId,
    });
    if (onSuccess) onSuccess();
  }

  const isDisabled =
    createProductImageMutation.isPending || !imageFile || createProductImageMutation.isSuccess;

  return (
    <FormLayout.FormLayout onSubmit={handleSubmit} isDisabled={isDisabled}>
      {imageFile && (
        <Image
          width={100}
          height={100}
          src={URL.createObjectURL(imageFile)}
          alt="product preview"
          className="h-56 w-56 object-contain"
        />
      )}

      <Input
        ref={fileInputRef}
        id="picture"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" type="button" className="w-full" onClick={handleRemoveImage}>
          Remove Image
        </Button>

        <FormLayout.FormSubmitButton text="Upload" />
      </div>
    </FormLayout.FormLayout>
  );
}
export default CreateProductImageForm;
