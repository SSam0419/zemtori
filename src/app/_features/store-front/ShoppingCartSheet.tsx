"use client";
import { Images, ShoppingCart, Trash } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/app/_shared/components/ui/button";
import { Checkbox } from "@/app/_shared/components/ui/checkbox";
import { Input } from "@/app/_shared/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_shared/components/ui/sheet";

import { CheckoutButton } from "./CheckoutButton";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "./hooks/useShoppingCartMutation";
import { useShoppingCartQuery } from "./hooks/useShoppingCartQuery";

export function ShoppingCartSheet() {
  const { storeId } = useParams<{ storeId: string }>();

  const removeCartItemMutation = useRemoveCartItemMutation();
  const shoppingCartQuery = useShoppingCartQuery({ shopId: storeId });
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost">
          <div className="flex items-center gap-1">
            <ShoppingCart />
            Shopping Cart
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[50vw]">
        <SheetHeader>
          <SheetTitle>My Shopping Cart</SheetTitle>
          <SheetDescription asChild>
            <div className="flex items-center">
              <>
                {shoppingCartQuery.data?.success
                  ? `${shoppingCartQuery.data?.payload.length} items in your cart`
                  : "No items in your cart"}
              </>

              <Button
                size="icon"
                variant="outline"
                disabled={checkedItems.length === 0 || removeCartItemMutation.isPending}
                className="ml-auto"
                type="button"
                isLoading={removeCartItemMutation.isPending}
                onClick={async () => {
                  const confirm = window.confirm(
                    "Are you sure you want to delete the selected items?",
                  );
                  if (confirm) {
                    await checkedItems.forEach((cartItemId) => {
                      removeCartItemMutation.mutate({
                        shopId: storeId,
                        cartItemId,
                      });
                    });
                    setCheckedItems([]);
                  }
                }}
              >
                <Trash />
              </Button>
            </div>
          </SheetDescription>
        </SheetHeader>
        {shoppingCartQuery.data &&
          shoppingCartQuery.data.success &&
          shoppingCartQuery.data.payload.map((item) => {
            return (
              <CartItem
                key={item.cartItemId}
                item={{
                  cartItemId: item.cartItemId,
                  productName: item.productName,
                  productImageUrls: item.productImageUrls,
                  quantity: item.quantity,
                  price: item.price,
                }}
                setCheckedItems={setCheckedItems}
                checked={checkedItems.includes(item.cartItemId)}
              />
            );
          })}
        <p className="py-2 text-right">
          Subtotal : $
          {checkedItems.length === 0
            ? (shoppingCartQuery.data?.success &&
                shoppingCartQuery.data?.payload.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                )) ||
              0
            : (shoppingCartQuery.data?.success &&
                shoppingCartQuery.data?.payload.reduce(
                  (acc, item) =>
                    checkedItems.includes(item.cartItemId) ? acc + item.price * item.quantity : acc,
                  0,
                )) ||
              0}
        </p>
        <SheetClose asChild>
          {/* <Button type="button" className="my-6 w-full">
            {checkedItems.length === 0 ? "Check Out" : "Check Out Selected Items"}
          </Button> */}
          {/* {checkedItems.length === 0 ? "Check Out" : "Check Out Selected Items"} */}
          <CheckoutButton
            checkoutItems={
              shoppingCartQuery.data?.success
                ? shoppingCartQuery.data.payload.map((item) => ({
                    productId: item.productId,
                    productPricingId: item.pricingId.toString(),
                    quantity: item.quantity,
                  }))
                : []
            }
            shopId={storeId}
          />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

function CartItem({
  item,
  setCheckedItems,
  checked,
}: {
  item: {
    cartItemId: string;
    productName: string;
    productImageUrls: string[];
    quantity: number;
    price: number;
  };
  checked: boolean;
  setCheckedItems: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [quantity, setQuantity] = React.useState(item.quantity);
  const updateCartItemMutation = useUpdateCartItemMutation();
  const storeId = useParams<{ storeId: string }>().storeId;

  // Correct usage of useDebouncedCallback
  const debouncedUpdate = useDebouncedCallback(() => {
    updateCartItemMutation.mutate({
      shopId: storeId,
      cartItemId: item.cartItemId,
      quantity,
    });
  }, 1000);

  return (
    <div className="flex items-center">
      <Checkbox
        id={`cart-item-${item.cartItemId}`}
        checked={checked}
        onCheckedChange={() => {
          setCheckedItems((prev) => {
            if (prev.includes(item.cartItemId)) {
              return prev.filter((id) => id !== item.cartItemId);
            }
            return [...prev, item.cartItemId];
          });
        }}
      />
      <div className="grid grid-cols-4 gap-2 border-b p-2">
        <div className="relative col-span-1 flex items-center justify-center rounded border">
          {item.productImageUrls.length > 0 && (
            <Image
              src={item.productImageUrls[0]}
              alt={item.productName}
              className="h-16 w-16 object-contain"
              width={64}
              height={64}
            />
          )}
          {item.productImageUrls.length === 0 && <Images />}
        </div>
        <div className="col-span-3">
          <div>{item.productName}</div>
          <div className="grid grid-cols-3 items-center text-xs">
            <div className="col-span-2 grid grid-cols-4 items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (quantity === 1) {
                    return;
                  }
                  setQuantity((prev) => prev - 1);
                  debouncedUpdate();
                }}
              >
                -
              </Button>
              <Input
                value={quantity.toString()}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (!isNaN(newValue) && newValue > 0) {
                    setQuantity(newValue);
                  }
                }}
                className="col-span-2 text-center text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  setQuantity((prev) => prev + 1);
                  debouncedUpdate();
                }}
              >
                +
              </Button>
            </div>

            <div>
              <div className="text-right">${item.price * quantity}</div>
              <div className="text-right text-xs text-muted-foreground">(${item.price} / item)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
