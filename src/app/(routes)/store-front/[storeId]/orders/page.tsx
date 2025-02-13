import Image from "next/image";
import React from "react";

import { GetOrders } from "@/app/_server/store-actions/get-orders";
import { GetShipping } from "@/app/_server/store-actions/get-shipping";
import { Badge } from "@/app/_shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_shared/components/ui/card";
import { ScrollArea } from "@/app/_shared/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_shared/components/ui/table";

async function Page({
  params,
}: {
  params: Promise<{
    storeId: string;
  }>;
}) {
  const storeId = (await params).storeId;
  const data = await GetOrders({ shopId: storeId });
  const orderRecords = data.success ? data.payload : [];

  function getPaymentStatusBadge(status: string | null) {
    if (!status) return "bg-gray-100 text-gray-800";

    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    if (
      ["paid", "pending", "failed"].includes(status.toLowerCase() as "paid" | "pending" | "failed")
    ) {
      return statusStyles[status.toLowerCase() as "paid" | "pending" | "failed"];
    }
    return "bg-gray-100 text-gray-800";
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent className="">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Shipping Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderRecords.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">{order.createdAt}</TableCell>
                  <TableCell>
                    <div className="space-y-3">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                            <Image
                              src={product.productPricing.product.images[0].url}
                              alt={product.productPricing.product.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {product.productPricing.product.productName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="font-medium">
                          {product.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="font-medium">
                          ${product.productPricing.price}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.stripeCheckoutSessionId ? (
                      <ShippingAddress
                        storeId={storeId}
                        checkoutSessionId={order.stripeCheckoutSessionId}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getPaymentStatusBadge(order.paymentStatus)}
                    >
                      {order.paymentStatus || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default Page;

async function ShippingAddress({
  checkoutSessionId,
  storeId,
}: {
  checkoutSessionId: string;
  storeId: string;
}) {
  const data = await GetShipping({ checkoutSessionId, shopId: storeId });

  if (!data || !data.address) return <span className="text-muted-foreground">N/A</span>;

  const { address, name } = data;

  return (
    <div className="space-y-2 text-sm">
      <div className="font-medium">{name}</div>
      <div className="space-y-1 text-muted-foreground">
        <div>{address.line1}</div>
        {address.line2 && <div>{address.line2}</div>}
        <div>
          {address.city}, {address.state} {address.postal_code}
        </div>
        <div>{address.country}</div>
      </div>
    </div>
  );
}
