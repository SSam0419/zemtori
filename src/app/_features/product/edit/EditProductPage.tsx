import { format } from "date-fns";

import { GetAdminProducts } from "@/app/_server/admin-actions/composite/get-admin-products";
import { GetProductPricing } from "@/app/_server/admin-actions/resources/product/get-product-pricing";
import {
  PublishProductButton,
  UnpublishProductButton,
} from "@/app/_shared/components/action-button/UpdateProductStatusButton";
import Alert from "@/app/_shared/components/Alerts";
import { Badge } from "@/app/_shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_shared/components/ui/table";

import EditClassificationForm from "./edit-product-form/EditClassificationForm";
import EditImageForm from "./edit-product-form/EditImageForm";
import EditPricingForm from "./edit-product-form/EditPricingForm";
import EditProductForm from "./edit-product-form/EditProductForm";

async function EditProductPage({ productId }: { productId: string }) {
  const response = await GetAdminProducts({ productId });

  if (!response.success) {
    return <p>Something unexpected happened, {response.error.message}</p>;
  }
  const data = response.payload.data;
  if (data.length == 0) {
    return <p>Product Not Found</p>;
  }

  if (data.length > 1) return <p>Something unexpected happened</p>;

  const product = data[0];
  const canProductBeEdited = product.base.status !== "PUBLISHED";
  const allProductPricingQuery = await GetProductPricing(product.base.productId);
  const allProductPricing = allProductPricingQuery.success ? allProductPricingQuery.payload : [];

  const haveActivePricing =
    (product.productPricing.hasVariants
      ? allProductPricing.filter((p) => !p.isDefault && !p.isArchived).length
      : allProductPricing.filter((p) => p.isDefault && !p.isArchived).length) > 0;
  return (
    <div className="space-y-4">
      {!canProductBeEdited && (
        <div className="mb-8 flex h-full w-full items-center justify-center gap-1">
          <Alert
            className="flex-1"
            variant="warning"
            message="Product is published and cannot be edited, unpublish it to make changes!"
          />
          <UnpublishProductButton productId={product.base.productId} />
        </div>
      )}

      {canProductBeEdited && (
        <div className="mb-10">
          <PublishProductButton productId={product.base.productId} disabled={!haveActivePricing} />
          {!haveActivePricing && (
            <p className="text-sm text-destructive">
              You must have at least one active pricing to publish this product
            </p>
          )}
        </div>
      )}

      <EditImageForm
        productImages={product.base.productImages}
        canProductBeEdited={canProductBeEdited}
      />

      <EditProductForm
        canProductBeEdited={canProductBeEdited}
        productName={product.base.productName}
        productDescription={product.base.description}
        productStatus={product.base.status}
      />

      <EditClassificationForm
        canProductBeEdited={canProductBeEdited}
        tags={product.tags}
        category={{
          categoryId: product.category.categoryId,
          categoryName: product.category.categoryName,
        }}
      />

      <EditPricingForm
        canProductBeEdited={canProductBeEdited}
        productPricing={{
          hasVariants: product.productPricing.hasVariants,
          pricing: product.productPricing.pricing,
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>All the price that have been created for this product. </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of pricing for this product.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProductPricing.map((price, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      {price.createdAt
                        ? format(new Date(`${price.createdAt}Z`), "yyyy-MM-dd HH:mm")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {price.isArchived ? (
                        <Badge variant="archived">Archived</Badge>
                      ) : (
                        <Badge variant="active">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {price.isDefault ? (
                        <Badge variant="outline">Default</Badge>
                      ) : (
                        <Badge>Variants</Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      {price.variantValues.map((vv, idx) => {
                        return (
                          <Badge key={idx} variant="secondary">
                            {vv.variantValue.variantValueName}
                          </Badge>
                        );
                      })}
                    </TableCell>
                    <TableCell className="text-right">{price.price}</TableCell>
                    <TableCell className="text-right">{price.stock}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProductPage;
