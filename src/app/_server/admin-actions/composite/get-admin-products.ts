"use server";
import { desc, like } from "drizzle-orm/sql";

import { products as ProductsTable } from "@/app/_server/db/drizzle-schemas";
import { TProduct, TProductPricingDetails, TProductStatus } from "@/app/_shared/types/global-types";

import { getDrizzleClient } from "../../db/drizzle";
import { productPricing } from "../../db/drizzle-schemas";
import { getTenantDbByAdmin } from "../../db/get-tenant-db";
import { handleFailureReturn, handleSuccessReturn } from "../../utils/handle-return";

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

export async function GetAdminProducts({
  productId,
  params,
}: {
  productId?: string;
  params?: PaginationParams;
} = {}) {
  try {
    // Pagination defaults
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();
    // const sortBy = params?.sortBy || "created_at";
    // const sortOrder = params?.sortOrder || "desc";
    const filters = params?.filters || {};

    const db = await getTenantDbByAdmin();
    const drizzleClient = await getDrizzleClient(db);
    const result = await drizzleClient.query.products.findMany({
      with: {
        pricing: {
          with: {
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
      where: (products, { eq, like, inArray, between }) => {
        if (productId) {
          return eq(products.id, productId);
        } else if (search) {
          return like(products.productName, search);
        } else if (filters) {
          if (filters.status) {
            return inArray(products.productStatusId, filters.status);
          }
          if (filters.categoryId) {
            return inArray(products.categoryId, filters.categoryId);
          }
          if (filters.minPrice && filters.maxPrice) {
            return between(productPricing.price, filters.minPrice, filters.maxPrice);
          }
        }
      },
      orderBy: [desc(ProductsTable.createdBy)],
    });

    const count = search
      ? await drizzleClient.$count(ProductsTable, like(ProductsTable.productName, `${search}`))
      : await drizzleClient.$count(ProductsTable);

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
      }));
      // if (product.hasVariants) {
      //   pricing = product.pricing.map((p) => ({
      //     price: p.price,
      //     stock: p.stock,
      //     variantPricingId: p.id,
      //     isArchived: p.isArchived || false,
      //     isDefault: p.isDefault || false,
      //     variantValues: p.variantValues.map((v) => ({
      //       variantValueId: v.variantValue.id,
      //       variantValueName: v.variantValue.variantValueName,
      //       variantTypeId: v.variantValue.type.id,
      //       variantTypeName: v.variantValue.type.variantTypeName,
      //     })),
      //   }));
      // } else {
      //   defaultPrice = product.pricing[0].price;
      //   defaultStock = product.pricing[0].stock;
      //   pricing = product.pricing.map((p) => ({
      //     price: p.price,
      //     stock: p.stock,
      //     variantPricingId: p.id,
      //     isArchived: p.isArchived || false,
      //     isDefault: p.isDefault || false,
      //     variantValues: p.variantValues.map((v) => ({
      //       variantValueId: v.variantValue.id,
      //       variantValueName: v.variantValue.variantValueName,
      //       variantTypeId: v.variantValue.type.id,
      //       variantTypeName: v.variantValue.type.variantTypeName,
      //     })),
      //   }));
      // }

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
