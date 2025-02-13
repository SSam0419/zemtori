export type BasicInfo = {
  name: string;
  description: string;
};

export type Classification = {
  categoryId: string;
  tagIds: string[];
};

export type ProductVariant = {
  hasVariants: boolean;
  defaultPrice: number;
  defaultStock: number;
  variants: {
    price: number;
    stock: number;
    variantValues: {
      id: string;
      valueName: string;
      typeId: string;
      typeName: string;
    }[];
  }[];
};

export type ProductFormState = {
  basicInfo: BasicInfo;
  classification: Classification;
  variants: ProductVariant;
  images: File[];
  currentStep: number;
};
