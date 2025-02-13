"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

// Get variant values by shop ID

export async function GetVariantValuesByShopId(shopId?: string) {
  try {
    console.log("shopId", shopId);
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.variantValues.findMany({
      with: {
        type: true,
      },
    });
    const formattedData = result.map((variantValue) => ({
      id: variantValue.id,
      variantValueName: variantValue.variantValueName,
      variantTypeId: variantValue.variantTypeId,
      typeName: variantValue.type.variantTypeName,
    }));
    return handleSuccessReturn(formattedData);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
