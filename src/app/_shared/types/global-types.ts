export type TProductPricing = {
  hasVariants: boolean;
  pricing: TProductPricingDetails[];
};

export type TProductPricingDetails = {
  pricingId: string;
  variantValues: {
    variantValueId: string;
    variantValueName: string;
    variantTypeId: string;
    variantTypeName: string;
  }[];
  price: number;
  stock: number;
  isArchived: boolean;
  isDefault: boolean;
  attachedImages?: {
    imageUrl: string;
    imageId: string;
  }[];
};

export type TProductStatus = "DRAFT" | "PUBLISHED" | "PENDING" | "ARCHIVED";
export const TProductStatusOptions = ["DRAFT", "PUBLISHED", "PENDING", "ARCHIVED"];
const ProductStatusId = {
  DRAFT: "1",
  PUBLISHED: "2",
  PENDING: "4",
  ARCHIVED: "3",
};
export function getProductStatusId(status: TProductStatus): string {
  return ProductStatusId[status];
}
export type TProduct = {
  base: {
    productId: string;
    productName: string;
    description: string;
    status: TProductStatus;
    productImages: {
      imageId: string;
      imageUrl: string;
    }[];
  };
  category: {
    categoryId: string;
    categoryName: string;
  };
  tags: {
    tagId: string;
    tagName: string;
  }[];
  productPricing: TProductPricing;
};
