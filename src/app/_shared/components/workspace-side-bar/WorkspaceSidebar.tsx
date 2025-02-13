"use client";

import {
    Cloudy, CreditCard, HandCoins, PackagePlus, ReceiptText, ScrollText, Settings, ShoppingBasket,
    ShoppingCart, Tags
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail
} from '../ui/sidebar';
import ShopSwitcher from './ShopSwitcher';
import UserAuthAvatar from './UserAuthAvatar';


function WorkspaceSidebar() {
  const params = useParams<{
    shopId: string | undefined;
  }>();
  const hasShopId = params.shopId !== undefined && params.shopId !== null;
  console.log("params", params.shopId, hasShopId);
  const pathName = usePathname();
  const URL = {
    products: hasShopId ? `/workspace/${params.shopId || ""}/products` : "/workspace",
    newProduct: hasShopId ? `/workspace/${params.shopId || ""}/products/new2` : "/workspace",
    classification: hasShopId ? `/workspace/${params.shopId || ""}/classification` : "/workspace",
    orders: hasShopId ? `/workspace/${params.shopId || ""}/orders` : "/workspace",
    shoppingCart: hasShopId ? `/workspace/${params.shopId || ""}/shopping-cart` : "/workspace",
    stripeAccount: hasShopId ? `/workspace/${params.shopId || ""}/stripe-account` : "/workspace",
    stripePayments: hasShopId
      ? `/workspace/${params.shopId || ""}/stripe-account/payments`
      : "/workspace",
    stripePayout: hasShopId
      ? `/workspace/${params.shopId || ""}/stripe-account/payout`
      : "/workspace",
    settings: hasShopId ? `/workspace/${params.shopId || ""}/settings` : "/workspace",
    activities: hasShopId ? `/workspace/${params.shopId || ""}/activities` : "/workspace",
  };

  return (
    <Sidebar   collapsible='icon' variant='floating'  >
      <SidebarHeader>
        <ShopSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Products</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                isActive={hasShopId && URL.products == pathName}
                tooltip={"Products"}
                size="default"
              >
                <Link href={URL.products}>
                  <span>{<ShoppingBasket className="size-4" />}</span>
                  <span>{"Products"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                isActive={hasShopId && URL.newProduct == pathName}
                tooltip={"Create New Product"}
                size="default"
              >
                <Link href={URL.newProduct}>
                  <span>{<PackagePlus className="size-4" />}</span>
                  <span>{"Add Product"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                isActive={hasShopId && URL.classification == pathName}
                tooltip={"Classification"}
                size="default"
              >
                <Link href={URL.classification}>
                  <span>{<Tags className="size-4" />}</span>
                  <span>{"Classification"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Orders</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                isActive={hasShopId && URL.orders == pathName}
                tooltip={"Orders"}
                size="default"
              >
                <Link href={URL.orders}>
                  <span>{<ReceiptText className="size-4" />}</span>
                  <span>{"Orders"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                isActive={hasShopId && URL.shoppingCart == pathName}
                tooltip={"Shopping Cart"}
                size="default"
              >
                <Link href={URL.shoppingCart}>
                  <span>{<ShoppingCart className="size-4" />}</span>
                  <span>{"Shopping Cart"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"Stripe Account"}
                size="default"
                isActive={hasShopId && URL.stripeAccount == pathName}
              >
                <Link href={URL.stripeAccount}>
                  <span>
                    {
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.4 13.8c-2.4-.7-3.5-1.3-3.5-2.2 0-.8.7-1.3 1.9-1.3 2.3 0 4.6.9 6.2 1.7l.9-5.5c-1.3-.6-4-1.7-7.7-1.7-2.6 0-4.7.7-6.3 1.9-1.7 1.3-2.6 3.2-2.6 5.4 0 4.1 2.5 5.8 6.5 7 2.6.8 3.5 1.4 3.5 2.3 0 .9-.8 1.4-2.2 1.4-1.8 0-4.7-.9-6.7-2l-1 5.5c1.7.9 4.8 1.8 8.1 1.8 2.7 0 5-.6 6.6-1.8 1.8-1.3 2.7-3.2 2.7-5.6-.1-4.2-2.6-5.9-6.4-7.2z"
                          fill="#635BFF"
                        />
                      </svg>
                    }
                  </span>
                  <span>{"Stripe Account"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"Payments"}
                size="default"
                isActive={hasShopId && URL.stripePayments == pathName}
              >
                <Link href={URL.stripePayments}>
                  <span>{<HandCoins className="size-4" />}</span>
                  <span>{"Payments"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"Payout"}
                size="default"
                isActive={hasShopId && URL.stripePayout == pathName}
              >
                <Link href={URL.stripePayout}>
                  <span>{<CreditCard className="size-4" />}</span>
                  <span>{"Payout"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>E-commerce</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"My Store"}
                className="hover:cursor-pointer"
                size="default"
                onClick={() => {
                  if (!params.shopId) {
                    console.error("Shop ID is missing");
                    return;
                  }

                  try {
                    // Determine protocol based on environment
                    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
                    const domain = process.env.NEXT_PUBLIC_DOMAIN;

                    const storeUrl = `${protocol}://${params.shopId}.${domain}.com`;
                    window.open(storeUrl, "_blank", "noopener,noreferrer");
                  } catch (error) {
                    console.error("Error opening store URL:", error);
                  }
                }}
              >
                <a>
                  <span>
                    <Cloudy className="size-4" />
                  </span>
                  <span>Online Store</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"Settings"}
                className="hover:cursor-pointer"
                size="default"
                isActive={hasShopId && pathName === URL.settings}
              >
                <Link href={URL.settings} className="hover:cursor-pointer">
                  <span>
                    <Settings className="size-4" />
                  </span>
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                disabled={!hasShopId}
                asChild
                tooltip={"Settings"}
                className="hover:cursor-pointer"
                size="default"
                isActive={hasShopId && URL.activities == pathName}
              >
                <Link href={URL.activities} className="hover:cursor-pointer">
                  <span>
                    <ScrollText className="size-4" />
                  </span>
                  <span>Activities</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserAuthAvatar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default WorkspaceSidebar;
