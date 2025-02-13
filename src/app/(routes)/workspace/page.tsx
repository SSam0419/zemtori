import { redirect } from "next/navigation";

import { GetShop } from "@/app/_server/admin-actions/resources/shop/get-shop-by-id";

async function DefaultWorkspacePage() {
  const shopData = await GetShop();

  if (!shopData.success) {
    return (
      <div>
        Error loading shops
        {shopData.error.name === "AuthenticationError"
          ? "Please log in to view your shops"
          : shopData.error.message}
      </div>
    );
  }

  if (shopData.payload) {
    redirect(`/workspace/${shopData.payload.id}`);
  } else redirect("/on-boarding");
}

export default DefaultWorkspacePage;
