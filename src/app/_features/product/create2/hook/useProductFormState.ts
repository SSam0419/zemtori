import { useParams } from "next/navigation";
import { useEffect, useReducer } from "react";

import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useTagsQuery } from "@/app/_shared/hooks/queries/useTagsQuery";
import { useVariantValueQuery } from "@/app/_shared/hooks/queries/useVariantValueQuery";

type ProductVariant = {
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

type State = {
  // Basic Info
  name: string;
  description: string;

  // Images
  selectedFiles: File[];
  previews: string[];
  error: string | null;

  // Pricing
  productPricing: ProductVariant;

  // Classification
  selectedCategory: {
    id: string;
    category: string;
  };
  selectedTags: {
    id: string;
    tag: string;
  }[];
};

type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "ADD_FILES"; payload: { files: File[]; previews: string[] } }
  | { type: "REMOVE_IMAGE"; payload: number }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "UPDATE_PRODUCT_PRICING"; payload: ProductVariant }
  | { type: "UPDATE_SELECTED_CATEGORY"; payload: { id: string; category: string } }
  | { type: "UPDATE_SELECTED_TAGS"; payload: { id: string; tag: string }[] };

const MAX_IMAGES = 5;

const initialState: State = {
  name: "",
  description: "",
  selectedFiles: [],
  previews: [],
  error: null,
  productPricing: {
    hasVariants: true,
    defaultPrice: 0,
    defaultStock: 0,
    variants: [
      {
        variantValues: [],
        price: 0,
        stock: 0,
      },
    ],
  },
  selectedCategory: {
    id: "",
    category: "",
  },
  selectedTags: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "ADD_FILES":
      return {
        ...state,
        selectedFiles: [...state.selectedFiles, ...action.payload.files],
        previews: [...state.previews, ...action.payload.previews],
      };
    case "REMOVE_IMAGE":
      return {
        ...state,
        selectedFiles: state.selectedFiles.filter((_, i) => i !== action.payload),
        previews: state.previews.filter((_, i) => i !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_PRODUCT_PRICING":
      return { ...state, productPricing: action.payload };
    case "UPDATE_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "UPDATE_SELECTED_TAGS":
      return { ...state, selectedTags: action.payload };
    default:
      return state;
  }
}

export function useProductForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;

  const categoryQuery = useCategoryQuery(shopId);
  const tagQuery = useTagsQuery();
  const variantValueQuery = useVariantValueQuery();
  const categories = categoryQuery.data?.map((c) => ({ id: c.id, category: c.categoryName })) || [];

  useEffect(() => {
    return () => {
      state.previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [state.previews]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    if (state.selectedFiles.length + fileArray.length > MAX_IMAGES) {
      dispatch({ type: "SET_ERROR", payload: `You can upload a maximum of ${MAX_IMAGES} images.` });
      return;
    }

    dispatch({ type: "SET_ERROR", payload: null });
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    dispatch({ type: "ADD_FILES", payload: { files: fileArray, previews: newPreviews } });
    event.target.value = "";
  }

  function handleRemoveImage(index: number) {
    URL.revokeObjectURL(state.previews[index]);
    dispatch({ type: "REMOVE_IMAGE", payload: index });
  }

  function updateSelectedCategory(id: string) {
    const updatedCategory = categories.find((category) => category.id === id);
    if (!updatedCategory) return;
    dispatch({ type: "UPDATE_SELECTED_CATEGORY", payload: updatedCategory });
  }

  return {
    // State
    ...state,

    // Actions
    setName: (name: string) => dispatch({ type: "SET_NAME", payload: name }),
    setDescription: (description: string) =>
      dispatch({ type: "SET_DESCRIPTION", payload: description }),
    handleFileChange,
    handleRemoveImage,

    updateProductPricing: (pricing: ProductVariant) =>
      dispatch({ type: "UPDATE_PRODUCT_PRICING", payload: pricing }),
    updateSelectedCategory,
    updateSelectedTags: (tags: { id: string; tag: string }[]) =>
      dispatch({ type: "UPDATE_SELECTED_TAGS", payload: tags }),

    // Queries
    categoryQuery,
    tagQuery,
    variantValueQuery,
  };
}
