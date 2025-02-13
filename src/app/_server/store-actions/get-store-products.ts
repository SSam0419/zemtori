"use server";

import { and, between, desc, eq, inArray, like } from "drizzle-orm";

import { TProduct, TProductPricingDetails, TProductStatus } from "@/app/_shared/types/global-types";

import { getDrizzleClient } from "../db/drizzle";
import { productPricing, products } from "../db/drizzle-schemas";
import { getTenantDbBySubdomain } from "../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../utils/handle-return";

type SortField = "product_name" | "created_at" | "default_price" | "default_stock";
type SortOrder = "asc" | "desc";

type FilterOptions = {
  status?: string[];
  categoryId?: string[];
  minPrice?: number;
  maxPrice?: number;
  hasVariants?: boolean;
};

type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  filters?: FilterOptions;
};

type PaginatedResponse = {
  data: TProduct[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};

export async function GetStoreProducts({
  storeId,
  productId,
  params,
  categoryId,
}: {
  storeId: string;
  productId?: string;
  categoryId?: string;
  params?: PaginationParams;
}) {
  try {
    console.log("GetStoreProducts", storeId, productId, params, categoryId);
    const db = await getTenantDbBySubdomain(storeId);
    if (!db) {
      throw new Error("Store Not Found");
    }
    const drizzleClient = await getDrizzleClient(db);

    // Pagination defaults
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const filters = params?.filters || {};
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();

    // eslint-disable-next-line no-inner-declarations
    function buildWhere() {
      const conditions = [];
      if (productId) {
        conditions.push(eq(products.id, productId));
      } else if (categoryId) {
        conditions.push(
          and(eq(products.categoryId, categoryId), eq(products.productStatusId, "2")),
        );
      } else if (search) {
        conditions.push(and(like(products.productName, search), eq(products.productStatusId, "2")));
      } else if (filters) {
        if (filters.status) {
          conditions.push(
            and(
              inArray(products.productStatusId, filters.status),
              eq(products.productStatusId, "2"),
            ),
          );
        }
        if (filters.categoryId) {
          conditions.push(
            and(
              inArray(products.categoryId, filters.categoryId),
              eq(products.productStatusId, "2"),
            ),
          );
        }
        if (filters.minPrice && filters.maxPrice) {
          conditions.push(
            and(
              between(productPricing.price, filters.minPrice, filters.maxPrice),
              eq(products.productStatusId, "2"),
            ),
          );
        }
      }

      return conditions.length > 0 ? and(...conditions) : eq(products.productStatusId, "2");
    }

    const result = await drizzleClient.query.products.findMany({
      with: {
        pricing: {
          with: {
            images: {
              with: { productImage: true },
            },
            variantValues: {
              with: {
                variantValue: {
                  with: {
                    type: true,
                  },
                },
              },
            },
          },
          where: (pricing, { eq }) => {
            return eq(pricing.isArchived, false);
          },
        },
        tags: {
          with: {
            tag: true,
          },
        },
        images: true,
        category: true,
        status: true,
      },
      offset: offset,
      limit: limit,
      where: buildWhere(),
      orderBy: [desc(products.createdBy)],
    });

    const count = await drizzleClient.$count(products, buildWhere());

    const formattedData: TProduct[] = result.map((product) => {
      const tags = product.tags.map((t) => ({
        tagId: t.tagId,
        tagName: t.tag.tagName,
      }));
      const images = product.images.map((i) => ({
        imageId: i.id,
        imageUrl: i.url,
      }));
      const pricing: TProductPricingDetails[] = product.pricing.map((p) => ({
        price: p.price,
        stock: p.stock,
        pricingId: p.id,
        isArchived: p.isArchived || false,
        isDefault: p.isDefault || false,
        variantValues: p.variantValues.map((v) => ({
          variantValueId: v.variantValue.id,
          variantValueName: v.variantValue.variantValueName,
          variantTypeId: v.variantValue.type.id,
          variantTypeName: v.variantValue.type.variantTypeName,
        })),
        attachedImages: p.images.map((i) => ({
          imageUrl: i.productImage.url,
          imageId: i.productImageId,
        })),
      }));

      return {
        base: {
          productId: product.id,
          productName: product.productName,
          description: product.description,
          status: (product.status?.status as TProductStatus) || ("DRAFT" as TProductStatus),
          productImages: images,
        },
        category: {
          categoryId: product.category?.id || "N/A",
          categoryName: product.category?.categoryName || "N/A",
        },
        productPricing: {
          hasVariants: product.hasVariants || false,
          pricing: pricing,
        },
        tags,
      };
    });
    const _response: PaginatedResponse = {
      data: formattedData,
      pagination: {
        total: Number(count),
        page,
        totalPages: Math.ceil(Number(count) / limit),
        limit,
      },
    };

    return handleSuccessReturn(_response);
  } catch (error) {
    console.error(error);
    return handleFailureReturn(error);
  }
}
