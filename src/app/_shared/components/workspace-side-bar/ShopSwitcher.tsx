"use client";

import { Store } from "lucide-react";
import React from "react";

import { DropdownMenu } from "@/app/_shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_shared/components/ui/sidebar";

import { useShopQuery } from "../../hooks/queries/useShopQuery";

function ShopSwitcher() {
  const shopQuery = useShopQuery();
  const shopData = React.useMemo(() => shopQuery.data, [shopQuery.data]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <a href={"/workspace"} className="flex items-center gap-2">
              <span>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Store className="size-4 bg-sidebar-primary text-sidebar-primary-foreground" />
                </div>
              </span>
              <span>
                {shopQuery.isSuccess
                  ? shopData && shopData.shopName
                  : shopQuery.isError
                    ? shopQuery.error.message
                    : "-"}
              </span>
            </a>

            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Store className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{shopData.shopName}</span>
              <span className="truncate text-xs">{shopData.description}</span>
            </div> */}
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default ShopSwitcher;
