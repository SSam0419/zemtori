import StoreCurrency from '@/app/_features/settings/StoreCurrency';
import StoreStatus from '@/app/_features/settings/StoreStatus';
import SubdomainSetting from '@/app/_features/settings/SubdomainSetting';
import { GetShop } from '@/app/_server/admin-actions/resources/shop/get-shop-by-id';
import { GetStripeAccount } from '@/app/_server/admin-actions/resources/stripe/get-stripe-account';
import {
    GetStripeAccountID
} from '@/app/_server/admin-actions/resources/stripe/get-stripe-account-id';
import { isStoreValid } from '@/app/_server/is-store-valid';
import Alert from '@/app/_shared/components/Alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_shared/components/ui/card';


async function page({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const stripeAccountId = await GetStripeAccountID();
  const stripeAccount =
    stripeAccountId.success && stripeAccountId.payload.id
      ? await GetStripeAccount(stripeAccountId.payload.id)
      : null;
  const hasStripeAccount =
    stripeAccount && stripeAccount.success && stripeAccount.payload.payouts_enabled;
  const isStoreUp = await isStoreValid(shopId);

  const shopResponse = await GetShop();
  const shop = shopResponse.success ? shopResponse.payload : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasStripeAccount && (
          <Alert
            variant="warning"
            message="You need to connect your stripe account to receive payments."
          />
        )}

        {!isStoreUp && (
          <Alert
            variant="warning"
            message="Store cannot be deployed. Please check your stripe account."
          />
        )}

        <StoreStatus isOnline={shop?.isShopOnline || false} />
        <SubdomainSetting shopId={shopId} />
        <StoreCurrency currentCurrency={shop?.currency || "usd"} />
      </CardContent>
    </Card>
  );
}

export default page;
