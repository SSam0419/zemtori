"use client";
import { Input } from '@/app/_shared/components/ui/input';
import { Label } from '@/app/_shared/components/ui/label';


export default function SubdomainSetting({ shopId }: { shopId: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="shop-domain">{"Shop's subdomain"}</Label>
      <div className="relative">
        <Input
          id="shop-domain"
          value={shopId}
          disabled
          className="peer pe-12"
          placeholder="shop-name-123"
          type="text"
        />
        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
          {".zemtori.com"}
        </span>
      </div>
    </div>
  );
}
