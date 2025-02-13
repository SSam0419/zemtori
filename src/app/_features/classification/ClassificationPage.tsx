import React from "react";

import { GetTags } from "@/app/_server/admin-actions/resources/tags/get-tags-by-shop-id";
import { GetCategories } from "@/app/_server/shared-actions/category/get-categories";

import CategorySection from "./category-section/CategorySection";
import TagSection from "./tag-section/TagSection";

async function ClassificationPage() {
  const [categories, tags] = await Promise.all([await GetCategories(), await GetTags()]);

  return (
    <div className="space-y-10">
      {categories.success && (
        <CategorySection
          categories={categories.payload.map((category) => ({
            id: category.id,
            categoryName: category.categoryName,
            description: category.description,
            parentCategoryId: category.parentCategoryId,
            parentCategoryName:
              categories.payload.find((c) => c.id === category.parentCategoryId)?.categoryName ||
              null,
          }))}
        />
      )}

      {tags.success && <TagSection tags={tags.payload} />}
    </div>
  );
}

export default ClassificationPage;
