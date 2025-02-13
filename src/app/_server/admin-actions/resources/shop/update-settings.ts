"use server";

import { getDrizzleClient } from '@/app/_server/db/drizzle';
import { shops } from '@/app/_server/db/drizzle-schemas';
import { getTenantDbByAdmin } from '@/app/_server/db/get-tenant-db';
import { TenantRecordClient } from '@/app/_server/db/tenant-record-client';
import { handleFailureReturn, handleSuccessReturn } from '@/app/_server/utils/handle-return';
import { STORE_CURRENCY_OPTIONS } from '@/app/_shared/constant';

import { isUserSignedIn } from '../../auth/user-auth';


export async function UpdateShopOnlineStatus({ isOnline }: { isOnline: boolean }) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient
      .update(shops)
      .set({
        isShopOnline: isOnline,
      })
      .returning();

    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}

export async function UpdateShopSubdomain({ subdomain }: { subdomain: string }) {
  try {
    const userId = await isUserSignedIn();
    if (!userId) {
      throw new Error("User not signed in");
    }

    // compare to see if which shop does user own
    const { rows } = await TenantRecordClient.execute({
      sql: `select * from tenant_record where owner_clerk_id = ?`,
      args: [userId],
    });

    if (rows.length > 1) {
      throw new Error("User has more than one shop");
    }
    if (rows.length === 0) {
      throw new Error("User has no shop");
    }

    const response = await TenantRecordClient.execute({
      sql: `update tenant_record set subdomain = ? where owner_clerk_id = ? returning *`,
      args: [subdomain, userId],
    });

    return handleSuccessReturn(response);
  } catch (error) {
    return handleFailureReturn(error);
  }
}

export async function UpdateShopCurrency(currency: string) {
  try {
    const availableCurrency = STORE_CURRENCY_OPTIONS.map((currency) => currency.value);
    if (!availableCurrency.includes(currency)) {
      return handleFailureReturn(
        Error(`The currency *${currency}* trying to be updated is not supported`),
      );
    }

    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const result = await drizzleClient
      .update(shops)
      .set({
        currency,
      })
      .returning();
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
