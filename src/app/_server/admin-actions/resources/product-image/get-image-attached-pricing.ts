"use server";

import { getDrizzleClient } from "@/app/_server/db/drizzle";
import { getTenantDbByAdmin } from "@/app/_server/db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "@/app/_server/utils/handle-return";

export async function GetImageAttachedPricing({ imageId }: { imageId: string }) {
  try {
    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);

    const result = await drizzleClient.query.productImages.findMany({
      where: (img, { eq }) => eq(img.id, imageId),
      with: {
        productPricing: {
          with: {
            productPricing: {
              with: {
                variantValues: {
                  with: {
                    variantValue: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return handleSuccessReturn(result);
  } catch (error) {
    return handleFailureReturn(error);
  }
}
