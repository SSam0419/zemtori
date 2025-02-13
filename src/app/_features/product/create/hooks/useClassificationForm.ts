import { useParams } from "next/navigation";
import { useState } from "react";

import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useTagsQuery } from "@/app/_shared/hooks/queries/useTagsQuery";

export function useClassificationForm(onSubmit: () => void) {
  const params = useParams<{ shopId: string }>();
  const shopId = params.shopId;

  const categoryQuery = useCategoryQuery(shopId);
  const categories = categoryQuery.data?.map((c) => ({ id: c.id, category: c.categoryName })) || [];
  const tagQuery = useTagsQuery();

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    category: string;
  }>({
    id: "",
    category: "",
  });

  const [selectedTags, setSelectedTags] = useState<
    {
      id: string;
      tag: string;
    }[]
  >([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function updateSelectedTags(
    selectedTags: {
      id: string;
      tag: string;
    }[],
  ) {
    setSelectedTags(selectedTags);
  }

  function updateSelectedCategory(id: string) {
    const updatedCategory = categories.find((category) => category.id === id);
    if (!updatedCategory) return;
    setSelectedCategory(updatedCategory);
  }

  return {
    categoryQuery,
    tagQuery,
    selectedCategory,
    selectedTags,
    handleSubmit,
    updateSelectedTags,
    updateSelectedCategory,
  };
}
