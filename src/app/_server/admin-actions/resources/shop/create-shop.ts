"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { shops } from "@/app/_server/db/drizzle-schemas";
import { getTenantDbBySubdomain } from "@/app/_server/db/get-tenant-db";
import { CreateNewTenantDb } from "@/app/_server/tenant-actions/create-tenant-db";
import { DatabaseError } from "@/app/_server/utils/errors";
import { getUUID } from "@/app/_server/utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

import { isUserSignedIn } from "../../auth/user-auth";

export async function CreateShop(shopData: {
  shopName: string;
  description: string;
  socialUrlFacebook?: string | null;
  socialUrlInstagram?: string | null;
  socialUrlLinkedin?: string | null;
  address?: string | null;
}) {
  try {
    const userId = await isUserSignedIn();
    const shopId = getUUID();
    //first create tenant db for this shop, default subdomain is shopId
    await CreateNewTenantDb({
      ownerClerkId: userId,
      shopId: shopId,
    });

    const db = await getTenantDbBySubdomain(shopId);
    if (!db) {
      throw new DatabaseError("Failed to create shop");
    }
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .insert(shops)
      .values({
        id: shopId,
        shopName: shopData.shopName,
        description: shopData.description,
        socialUrlFacebook: shopData.socialUrlFacebook || null,
        socialUrlInstagram: shopData.socialUrlInstagram || null,
        socialUrlLinkedin: shopData.socialUrlLinkedin || null,
        address: shopData.address || null,
      })
      .returning({
        id: shops.id,
        shopName: shops.shopName,
        description: shops.description,
        socialUrlFacebook: shops.socialUrlFacebook,
        socialUrlInstagram: shops.socialUrlInstagram,
        socialUrlLinkedin: shops.socialUrlLinkedin,
        createdAt: shops.createdAt,
        updatedAt: shops.updatedAt,
        createdBy: shops.createdBy,
        updatedBy: shops.updatedBy,
      });

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
