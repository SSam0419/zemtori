import { format } from "date-fns";
import {
  Badge,
  Calendar,
  Cloud,
  CreditCard,
  Lock,
  LogOut,
  Mail,
  Settings,
  Shield,
  ShieldAlert,
  Unlock,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";

import { GetOrderRecords } from "@/app/_server/admin-actions/resources/order/get-order-records";
import { Button } from "@/app/_shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_shared/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_shared/components/ui/popover";
import { Separator } from "@/app/_shared/components/ui/separator";
import { StripePaymentDetailsUI } from "@/app/_shared/StripeUI";
import { clerkClient, User } from "@clerk/nextjs/server";

async function Page() {
  const data = await GetOrderRecords();
  const _clerkClient = await clerkClient();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{"Order Records"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 items-center gap-4 text-muted-foreground">
          <div>Ordered At</div>
          <div>Payment Details</div>
          <div>Customer</div>
          <div>Payment Status</div>
          <div>Order Status</div>

          <div></div>
        </div>
        {data.success && data.payload.length === 0 && (
          <p className="w-full p-10 text-center">No orders.</p>
        )}
        {!data.success && <p>{data.error.message}</p>}
        {data.success &&
          data.payload.map(async (item) => {
            const user = await _clerkClient.users.getUser(item.customerId);
            return (
              <div key={item.id} className="my-1 grid grid-cols-6 items-center gap-4">
                <div>{item.createdAt}</div>
                <div>
                  {item.stripePaymentIntentId ? (
                    <StripePaymentDetailsUI payment={item.stripePaymentIntentId} />
                  ) : (
                    "No payment details"
                  )}
                </div>
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

                <div>{item.paymentStatus || "N/A"}</div>
                <div>{item.orderStatus || "N/A"}</div>

                {/* Action Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon">
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <CreditCard />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield />
                        <span>Update Status</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Badge />
                        <span>Cancel Order</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail />
                        <span>Resend Invoice</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Cloud />
                        <span>Refund Payment</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut />
                      <span>Delete Order</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
