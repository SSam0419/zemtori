"use client";
import { FileSymlink, Settings, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

import CreateProductImageButton from "@/app/_shared/components/action-button/CreateProductImageButton";
import Alert from "@/app/_shared/components/Alerts";
import * as FormLayout from "@/app/_shared/components/layout/form-layout/FormLayout";
import { Button } from "@/app/_shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_shared/components/ui/dropdown-menu";
import { useCreateImageAttach } from "@/app/_shared/hooks/mutations/useCreateImageAttach";
import { useRemoveProductImageMutation } from "@/app/_shared/hooks/mutations/useRemoveProductImageMutation";
import {
  invalidateImageAttachmentQuery,
  useImageAttachmentQuery,
} from "@/app/_shared/hooks/queries/useImageQuery";
import { useProductPricingQuery } from "@/app/_shared/hooks/queries/useProductPricingQuery";

import EditFormLayout from "../layout/EditFormLayout";

function EditImageForm({
  productImages,
  canProductBeEdited,
}: {
  canProductBeEdited: boolean;
  productImages: {
    imageId: string;
    imageUrl: string;
  }[];
}) {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  return (
    <EditFormLayout
      canProductBeEdited={canProductBeEdited}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      EditComponent={
        <FormLayout.FormLayout
          onSubmit={async () => {
            setIsEditing(false);
          }}
        >
          <p className="text-xl font-semibold">Image Assets</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {productImages.map((image) => {
              return <EditImageCard key={image.imageId} image={image} />;
            })}
          </div>
          <CreateProductImageButton />
        </FormLayout.FormLayout>
      }
      ViewComponent={
        <div className="">
          <p className="text-xl font-semibold">Image Assets</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {productImages.map((image) => {
              return (
                <div
                  key={image.imageId}
                  className="relative h-36 w-36 rounded border border-dashed p-1"
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.imageUrl}
                    // width={100}
                    // height={100}
                    fill
                    className="object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

export default EditImageForm;

function EditImageCard({
  image,
}: {
  image: {
    imageId: string;
    imageUrl: string;
  };
}) {
  const removeProductImageMutation = useRemoveProductImageMutation();
  const [open, setOpen] = React.useState(false);
  const { productId } = useParams<{ productId: string }>();
  const [selectedPricing, setSelectedPricing] = React.useState<string | undefined>(undefined);
  const attachPricingMutation = useCreateImageAttach(() => {
    invalidateImageAttachmentQuery({
      imageId: image.imageId,
    });
    setOpen(false);
  });
  const imagePricingQuery = useImageAttachmentQuery({ imageId: image.imageId });
  const productPricingQuery = useProductPricingQuery({ productId });
  const productPricing = productPricingQuery.data || [];

  const attachedPricing = imagePricingQuery.data?.success
    ? imagePricingQuery.data.payload[0]
    : null;
  const attachedPricingIds = attachedPricing?.productPricing.map((pp) => pp.productPricingId) || [];
  const attachedVariants =
    attachedPricing?.productPricing.map((pp) => {
      return pp.productPricing.variantValues
        .map((vv) => vv.variantValue.variantValueName)
        .join(", ");
    }) || [];
  const formattedPricing = productPricing
    .filter((pricing) => !attachedPricingIds.includes(pricing.id))
    .map((pricing) => {
      return {
        label: pricing.variantValues
          .map((variantValue) => variantValue.variantValue.variantValueName)
          .join(", "),
        value: pricing.id,
      };
    });
  if (!productId) return <Alert variant="danger" message="Product ID is missing" />;

  return (
    <div>
      <div className="border-b-none relative h-40 w-40 rounded border-l border-r border-t border-dashed p-1">
        <Image src={image.imageUrl} alt={image.imageUrl} fill className="object-contain" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Image To Pricing</DialogTitle>
          </DialogHeader>
          {attachedVariants.length > 0 && (
            <div>
              <p>Attached Variants ({attachedVariants.length})</p>
              <div className="flex flex-wrap items-center gap-1">
                {attachedVariants.map((v, idx) => (
                  <p
                    key={idx}
                    className="w-fit rounded bg-blue-200 p-1 leading-none hover:shadow-md"
                  >
                    {v}
                  </p>
                ))}
              </div>
            </div>
          )}
          {attachedVariants.length == 0 && <p>No variants is attached to this image yet.</p>}
          <FormLayout.FormSelect
            formName="pricing"
            onValueChange={(val) => {
              setSelectedPricing(val);
            }}
            options={formattedPricing}
            value={selectedPricing}
            label="Pricing"
            isRequired
          />

          <Button
            onClick={() => {
              if (!selectedPricing) return;
              attachPricingMutation.mutate({ imageId: image.imageId, pricingId: selectedPricing });
            }}
          >
            Attach
          </Button>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full rounded-t-none" type="button">
            <div className="flex items-center justify-center gap-1">
              <Settings />
              Actions
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <FileSymlink />
            Attach
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const confirm = window.confirm("Are you sure you want to delete this image?");
              if (!confirm) return;
              removeProductImageMutation.mutate({
                imageId: image.imageId,
                imageUrl: image.imageUrl,
              });
            }}
          >
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
