import { format } from "date-fns";
import {
  Badge,
  Calendar,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  Unlock,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import { GetShoppingCartItems } from "@/app/_server/admin-actions/resources/order/get-shopping-cart-items";
import { Button } from "@/app/_shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_shared/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_shared/components/ui/popover";
import { Separator } from "@/app/_shared/components/ui/separator";
import { clerkClient, User } from "@clerk/nextjs/server";

async function Page() {
  const data = await GetShoppingCartItems();
  const _clerkClient = await clerkClient();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{"Customers' Shopping Cart Items"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 items-center gap-2 text-muted-foreground">
          <div>Product</div>
          <div>Quantity</div>
          <div>Customer</div>
        </div>
        {!data.success && <p>{data.error.message}</p>}
        {data.success &&
          data.payload.map(async (item) => {
            const user = await _clerkClient.users.getUser(item.customerId);
            return (
              <div key={item.productId} className="grid grid-cols-3 items-center gap-2">
                <div>{item.productName}</div>
                <div>{item.quantity}</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <div className="flex items-center gap-2">
                        <Image
                          src={user.imageUrl}
                          alt={"User Image"}
                          className="h-6 w-6 rounded-full"
                          width={24}
                          height={24}
                        />
                        {user.fullName}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <UserPopoverContent user={user} />
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}

export default Page;

function UserPopoverContent({ user }: { user: User }) {
  return (
    <div className="w-80 space-y-4">
      <div className="flex items-center gap-4">
        <Image
          src={user.imageUrl}
          alt={user.fullName || "-"}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold">{`${user.firstName} ${user.lastName}`}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-3 w-3" />
            <span>ID: {user.id.substring(0, 8)}...</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.emailAddresses[0]?.emailAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Security Status</h5>
        <div className="flex flex-col flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm">
            {user.passwordEnabled ? (
              <Lock className="mr-1 h-3 w-3" />
            ) : (
              <Unlock className="mr-1 h-3 w-3" />
            )}
            Password
          </div>
          <div className="flex items-center gap-1 text-sm">
            {user.twoFactorEnabled ? (
              <Shield className="mr-1 h-3 w-3" />
            ) : (
              <ShieldAlert className="mr-1 h-3 w-3" />
            )}
            2FA
          </div>

          {user.banned && <Badge>Banned</Badge>}
          {user.locked && <Badge>Locked</Badge>}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Last active: {user.lastActiveAt ? format(new Date(user.lastActiveAt), "MMM dd, yyyy") : "-"}
      </div>
    </div>
  );
}
