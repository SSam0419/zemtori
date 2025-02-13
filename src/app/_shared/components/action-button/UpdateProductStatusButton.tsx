"use client";

import { ArchiveX, Rss } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { UpdateProductStatus } from "@/app/_server/admin-actions/resources/product/update-product-status";

import { useUpdateProductStatus } from "../../hooks/mutations/useUpdateProductStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export function UnpublishProductButton({ productId }: { productId: string }) {
  const [isUnpublish, setIsUnpublish] = React.useState(false);
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" isLoading={isUnpublish} disabled={isUnpublish}>
          <div className="flex items-center gap-1">
            <ArchiveX />
            Unpublish Product From Store
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          <p>This will unpublish the product to the store.</p>
          <p>Are you sure you want to continue?</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setIsUnpublish(true);
              await UpdateProductStatus({
                productId,
                status: "DRAFT",
              });
              router.refresh();
            }}
            disabled={isUnpublish}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PublishProductButton({
  productId,
  disabled = false,
}: {
  disabled?: boolean;
  productId: string;
}) {
  const mutation = useUpdateProductStatus(async () => {
    router.refresh();
  });
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          isLoading={mutation.isPending}
          disabled={disabled || mutation.isPending}
        >
          <div className="flex items-center gap-1">
            <Rss />
            Publish Product To Store
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <p>This will publish the product to the store.</p>
          <p>Are you sure you want to continue?</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await mutation.mutateAsync({
                productId,
                status: "PUBLISHED",
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
