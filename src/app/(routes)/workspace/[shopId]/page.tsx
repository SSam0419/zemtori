import { notFound } from "next/navigation";

import { GetShop } from "@/app/_server/admin-actions/resources/shop/get-shops-by-user";
import WelcomingEffect from "@/app/_shared/components/common/WelcomingEffect";

async function Page(props: {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const searchParams = await props.searchParams;
  const isShopCreatedJustNow = searchParams.firstTime === "true";
  const shopData = await GetShop();
  if (!shopData.success) notFound();

  return (
    <div>
      {shopData.payload ? (
        <div>
          <p className="text-xl font-semibold">{shopData.payload.shopName}</p>
          <p className="text-base">{shopData.payload.description}</p>
        </div>
      ) : (
        "Not Found"
      )}
      {isShopCreatedJustNow && <WelcomingEffect />}
    </div>
  );
}

export default Page;
