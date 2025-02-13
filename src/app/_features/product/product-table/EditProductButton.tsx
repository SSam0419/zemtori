"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import { Button } from "@/app/_shared/components/ui/button";

function EditProductButton({ productId }: { productId: string }) {
  const { shopId } = useParams<{ shopId: string }>();
  return (
    <Link href={`/workspace/${shopId}/products/edit/${productId}`}>
      <Button variant="link" size="icon" type="button">
        Edit
      </Button>
    </Link>
  );
}

export default EditProductButton;
