"use client";
import { Home, ShoppingBasket } from "lucide-react";
import Link from "next/link";

import { Button } from "@/app/_shared/components/ui/button";
import UserAuthAvatar from "@/app/_shared/components/workspace-side-bar/UserAuthAvatar";

import { ShoppingCartSheet } from "./ShoppingCartSheet";

function Navbar() {
  return (
    <div className="flex w-full items-center justify-between">
      <Button size="icon" variant="ghost">
        <Link href="/">
          <Home />
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <Link href={`/orders`} className="flex items-center gap-1">
          <ShoppingBasket /> Order History
        </Link>

        <ShoppingCartSheet />

        <UserAuthAvatar />
      </div>
    </div>
  );
}

export default Navbar;
