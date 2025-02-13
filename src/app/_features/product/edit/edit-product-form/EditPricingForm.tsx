"use client";

import {
  ArrowLeftRight,
  ArrowUpFromLine,
  DiamondPlus,
  Files,
  Package,
  Settings,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import { revalidateEditProductPage } from "@/app/_server/revalidate-paths";
import CreateProductPricingButton from "@/app/_shared/components/action-button/CreateProductPricingButton";
import UpdateProductStockForm from "@/app/_shared/components/form/product-stock-form/UpdateProductStockForm";
import { Badge } from "@/app/_shared/components/ui/badge";
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
import { useUpdateProductHasVariants } from "@/app/_shared/hooks/mutations/useUpdateProductHasVariants";
import {
  useActivateProductPricingStatus,
  useArchiveProductPricingStatus,
} from "@/app/_shared/hooks/mutations/useUpdateProductPricingStatus";
import { TProductPricing } from "@/app/_shared/types/global-types";

import EditFormLayout from "../layout/EditFormLayout";

function EditPricingForm({
  productPricing,
  canProductBeEdited,
}: {
  canProductBeEdited: boolean;
  productPricing: TProductPricing;
}) {
  const { productId } = useParams<{ productId: string }>();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const updateHasVariantsMutation = useUpdateProductHasVariants(revalidateEditProductPage);

  return (
    <EditFormLayout
      canProductBeEdited={canProductBeEdited}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      ViewComponent={
        <>
          <p className="text-xl font-semibold">Pricing & Stock</p>
          <p className="text-sm text-muted-foreground">
            Pricing cannot be deleted if customers has place an order with that price
          </p>

          {
            <div className="my-1 grid grid-cols-7 items-center gap-1">
              <p className="col-span-4">Variants</p>
              <p className="col-span-1">Price</p>
              <p className="col-span-1">Stock</p>
              <p className="col-span-1">Status</p>
            </div>
          }

          {productPricing.pricing
            .filter((price) => price.isDefault == !productPricing.hasVariants)
            .map((variant, idx) => {
              return (
                <div key={idx} className="grid grid-cols-7 items-center gap-1">
                  <div className="col-span-4 flex items-center gap-1">
                    {productPricing.hasVariants ? (
                      variant.variantValues.map((vv) => (
                        <Badge key={vv.variantValueId}>
                          {vv.variantTypeName}:{vv.variantValueName}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </div>

                  <p className="col-span-1">{variant.price}</p>
                  <p className="col-span-1">{variant.stock}</p>
                  <div className="col-span-1">
                    {variant.isArchived ? (
                      <Badge variant="archived">Archived</Badge>
                    ) : (
                      <Badge variant="active">Active</Badge>
                    )}
                  </div>
                </div>
              );
            })}
        </>
      }
      EditComponent={
        <>
          <p className="text-xl font-semibold">Pricing & Stock</p>
          <p className="text-sm text-muted-foreground">
            Pricing cannot be deleted if customers has place an order with that price
          </p>
          <p>
            <Button
              type="button"
              variant="outline"
              className="my-4 w-full"
              isLoading={updateHasVariantsMutation.isPending}
              disabled={updateHasVariantsMutation.isPending}
              onClick={() => {
                if (!productId) {
                  return;
                }
                updateHasVariantsMutation.mutate({
                  productId: productId,
                  hasVariants: !productPricing.hasVariants,
                });
              }}
            >
              <div className="flex items-center gap-1">
                <ArrowLeftRight />
                Switch To
                {productPricing.hasVariants ? " Default Product (No Variants)" : " Variants"}
              </div>
            </Button>
          </p>
          <div className="w-full rounded-lg border-4 border-dashed p-1">
            <div className="grid grid-cols-7 items-center gap-1 border-b text-muted-foreground">
              <p className="col-span-3">Variants</p>
              <p className="col-span-1">Price</p>
              <p className="col-span-1">Stock</p>
              <p className="col-span-1">Status</p>
              <p></p>
            </div>

            {productPricing.pricing
              .filter((price) => price.isDefault == !productPricing.hasVariants)
              .map((variant, idx) => {
                return (
                  <div key={idx} className="my-1 grid grid-cols-7 items-center gap-1">
                    <div className="col-span-3 flex items-center gap-1">
                      {variant.variantValues.map((vv) => (
                        <Badge key={vv.variantValueId}>
                          {vv.variantTypeName}:{vv.variantValueName}
                        </Badge>
                      ))}
                    </div>

                    <p className="col-span-1">{variant.price}</p>
                    <p className="col-span-1">{variant.stock}</p>
                    <div className="col-span-1">
                      {variant.isArchived ? (
                        <Badge variant="archived">Archived</Badge>
                      ) : (
                        <Badge variant="active">Active</Badge>
                      )}
                    </div>
                    <DropdownActions priceId={variant.pricingId} stock={variant.stock} />
                  </div>
                );
              })}
          </div>

          <CreateProductPricingButton
            content={
              <Button type="button" className="mt-6 w-full">
                <div className="flex items-center gap-1">
                  <DiamondPlus />
                  Create New Pricing
                </div>
              </Button>
            }
          />
        </>
      }
    />
  );
}

export default EditPricingForm;

function DropdownActions({ priceId, stock }: { stock: number; priceId: string }) {
  const archivePricingMutation = useArchiveProductPricingStatus({
    successCallback: revalidateEditProductPage,
  });
  const activatePricingMutation = useActivateProductPricingStatus({
    successCallback: revalidateEditProductPage,
  });
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="icon" variant="secondary">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => {
              archivePricingMutation.mutate({
                productPricingId: priceId,
              });
            }}
          >
            <Files />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              activatePricingMutation.mutate({
                productPricingId: priceId,
              });
            }}
          >
            <ArrowUpFromLine />
            <span>Activate</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <Package />
            <span>Adjust Stock</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          <UpdateProductStockForm
            pricingId={priceId}
            stock={stock}
            successCallback={() => {
              setOpen(false);
              revalidateEditProductPage();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
