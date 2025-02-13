"use client";
import { useState } from 'react';

import { revalidateSettingPage } from '@/app/_server/revalidate-paths';
import { Button } from '@/app/_shared/components/ui/button';
import { Label } from '@/app/_shared/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/app/_shared/components/ui/select';
import { useUpdateShopOnlineStatus } from '@/app/_shared/hooks/mutations/useUpdateShopSettings';


function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

function StoreStatus({ isOnline }: { isOnline: boolean }) {
  const statusMutation = useUpdateShopOnlineStatus(() => {
    revalidateSettingPage();
  });

  const [isStoreOnline, setIsStoreOnline] = useState(isOnline);
  const isDifferent = isStoreOnline !== isOnline;

  return (
    <div className="space-y-2">
      <Label htmlFor="store-status">Current Store Status</Label>
      <Select
        defaultValue={isStoreOnline ? "online" : "offline"}
        onValueChange={(val: string) => {
          if (val === "online") {
            setIsStoreOnline(true);
          } else if (val === "offline") {
            setIsStoreOnline(false);
          } else {
            console.error("Unknown value received");
            return;
          }

          if (statusMutation.status !== "idle") {
            statusMutation.reset();
          }
        }}
      >
        <SelectTrigger
          id="store-status"
          className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          <SelectItem value="online">
            <span className="flex items-center gap-2">
              <StatusDot className="text-emerald-600" />
              <span className="truncate">
                Online{" "}
                <span className="text-muted-foreground">
                  Customers can visit your online store at anytime.
                </span>
              </span>
            </span>
          </SelectItem>
          <SelectItem value="offline">
            <span className="flex items-center gap-2">
              <StatusDot className="text-gray-500" />
              <span className="truncate">
                Offline{" "}
                <span className="text-muted-foreground">Online shop cannot be visited now</span>
              </span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {isDifferent && !statusMutation.isSuccess && (
        <Button
          type="button"
          onClick={() =>
            statusMutation.mutate({
              isOnline: isStoreOnline,
            })
          }
          className="w-full"
          variant="outline"
          isLoading={statusMutation.isPending}
          disabled={!isDifferent || statusMutation.isPending || statusMutation.isSuccess}
          hasBorderBeam={isDifferent}
        >
          Save Changes
        </Button>
      )}
    </div>
  );
}

export default StoreStatus;
