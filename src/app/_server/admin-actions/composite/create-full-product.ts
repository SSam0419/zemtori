"use server";

import { getDrizzleClient } from "../../db/drizzle";
import {
  productImages as productImagesTable,
  productPricing,
  productPricingValues,
  products,
  tagProducts,
} from "../../db/drizzle-schemas";
import { getTenantDbByAdmin } from "../../db/get-tenant-db";
import { getUUID } from "../../utils/get-uuid";
import { handleFailureReturn, handleSuccessReturn } from "../../utils/handle-return";
import { DeleteImage, getKeyFromUrl } from "../resources/file-upload/delete-file-r2";
// import { DeleteImage, getKeyFromUrl } from "../resources/file-upload/delete-file-r2";
import { UploadImage } from "../resources/file-upload/upload-file-r2";

export type CreateProductCompleteBody = {
  productName: string;
  description: string;
  categoryId: string;
  tagIds: string[];
  productPricing: {
    hasVariants: boolean;
    defaultPrice: number;
    defaultStock: number;
    variants: {
      variantValues: {
        variantTypeId: string;
        variantValueId: string;
      }[];
      price: number;
      stock: number;
    }[];
  };
  productImages: File[];
};

export async function CreateFullProduct({
  productName,
  description,
  categoryId,
  tagIds,
  productPricing: { hasVariants, defaultPrice, defaultStock, variants = [] },
  productImages,
}: CreateProductCompleteBody) {
  let db;
  const fileUrls: string[] = [];
  try {
    db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.transaction(async (tx) => {
      const uuid = getUUID();
      console.log("@CreateFullProduct Start transaction ", uuid);

      const productIds = await tx
        .insert(products)
        .values({
          id: getUUID(),
          description,
          productName,
          categoryId,
          hasVariants,
        })
        .returning({
          id: products.id,
        });
      const productId = productIds[0].id;
      console.log(`@transaction ${uuid} created product`, { productId });
      for (const image of productImages) {
        const { fileUrl } = await UploadImage(image);
        await tx.insert(productImagesTable).values({
          id: getUUID(),
          productId,
          url: fileUrl,
          displayOrder: 0,
        });
        fileUrls.push(fileUrl);
        console.log(`@transaction ${uuid} uploaded image`, { fileUrl });
      }

      await tx.insert(productPricing).values({
        id: getUUID(),
        productId,
        price: defaultPrice,
        stock: defaultStock,
        isDefault: true,
      });
      console.log(`@transaction ${uuid} created default pricing`, { defaultPrice, defaultStock });

      if (hasVariants) {
        for (const variant of variants) {
          const productPricingId = getUUID();
          await tx.insert(productPricing).values({
            id: productPricingId,
            productId,
            price: variant.price,
            stock: variant.stock,
            isDefault: false,
          });
          console.log(`@transaction ${uuid} created variant pricing`, {
            price: variant.price,
            stock: variant.stock,
          });
          for (const variantValue of variant.variantValues) {
            await tx.insert(productPricingValues).values({
              productPricingId,
              variantValueId: variantValue.variantValueId,
            });
            console.log(`@transaction ${uuid} created variant pricing value`, {
              variantValueId: variantValue.variantValueId,
            });
          }
        }
        for (const tagId of tagIds) {
          await tx.insert(tagProducts).values({
            productId,
            tagId,
          });
          console.log(`@transaction ${uuid} added tag to product`, { tagId });
        }
      }
    });
    return handleSuccessReturn({
      result,
    });
  } catch (error) {
    if (fileUrls.length > 0) {
      await Promise.all(
        fileUrls.map(async (url) => {
          const key = await getKeyFromUrl(url);
          try {
            await DeleteImage(key);
          } catch (error) {
            console.error(`Error @ deleting image url ${error}`);
          }
        }),
      );
    }
    return handleFailureReturn(error);
  }
}
