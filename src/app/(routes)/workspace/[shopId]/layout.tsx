import { redirect } from "next/navigation";

import { GetShop } from "@/app/_server/admin-actions/resources/shop/get-shops-by-user";

async function WorkspaceLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ shopId: string }>;
  }>,
) {
  const { children, params } = props;
  const { shopId } = await params;
  const shop = await GetShop();

  if (!shop.success || !shop.payload) {
    return <div>Failed</div>;
  }

  if (shopId !== shop.payload.id) {
    redirect(`/workspace/${shop.payload.id}`);
  }

  return <>{children}</>;
}

export default WorkspaceLayout;
