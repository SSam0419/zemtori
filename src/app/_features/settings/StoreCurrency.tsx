"use client";

import { useState } from 'react';

import { revalidateSettingPage } from '@/app/_server/revalidate-paths';
import { Button } from '@/app/_shared/components/ui/button';
import { Label } from '@/app/_shared/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/app/_shared/components/ui/select';
import { STORE_CURRENCY_OPTIONS } from '@/app/_shared/constant';
import { useUpdateShopCurrency } from '@/app/_shared/hooks/mutations/useUpdateShopSettings';


function StoreCurrency({ currentCurrency }: { currentCurrency: string }) {
  const currencyMutation = useUpdateShopCurrency(() => {
    revalidateSettingPage();
  });

  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const isDifferentCurrency = selectedCurrency !== currentCurrency;

  return (
    <div>
      <Label htmlFor="store-currency">Store Currency</Label>
      <div className="flex items-center justify-between gap-1">
        <Select
          defaultValue={currentCurrency}
          onValueChange={(val) => {
            setSelectedCurrency(val);
            if (currencyMutation.status !== "idle") {
              currencyMutation.reset();
            }
          }}
          value={selectedCurrency}
        >
          <SelectTrigger>
            <SelectValue placeholder="the currency for the store" />
          </SelectTrigger>
          <SelectContent id="store-currency">
            {STORE_CURRENCY_OPTIONS.map((currency) => {
              return (
                <SelectItem value={currency.value} key={currency.value}>
                  <span className="mr-1 leading-none">{currency.flag}</span>
                  <span>{currency.label}</span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        The currency you choose will be used for all transactions in your store.
      </p>
      {isDifferentCurrency && !currencyMutation.isSuccess && (
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => currencyMutation.mutate(selectedCurrency)}
          isLoading={currencyMutation.isPending}
          disabled={
            !isDifferentCurrency || currencyMutation.isPending || currencyMutation.isSuccess
          }
          hasBorderBeam={isDifferentCurrency}
        >
          Save Changes
        </Button>
      )}
    </div>
  );
}

export default StoreCurrency;
