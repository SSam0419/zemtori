import { Pen } from "lucide-react";
import React from "react";

import CreateCategoryButton from "@/app/_shared/components/action-button/CreateCategoryButton";
import UpdateCategoryButton from "@/app/_shared/components/action-button/UpdateCategoryButton";
import { TreeItem } from "@/app/_shared/components/TreeView";

import CategoryProduct from "./CategorySection.CategoryProduct";
import CategoryTree from "./CategorySection.CategoryTree";
import { warn } from "console";

function CategorySection({
  categories,
}: {
  categories: {
    id: string;
    categoryName: string;
    description: string;
    parentCategoryId: string | null;
    parentCategoryName: string | null;
  }[];
}) {
  const rootCategories = categories.filter((c) => c.parentCategoryId === null);
  const categoryTree: TreeItem[] = [];

  function formTree(category: TreeItem): TreeItem[] {
    // Find children of the current category
    const children = categories.filter((c) => c.parentCategoryId === category.id);

    // Recursively process children and form the tree structure
    return children.map((child) => {
      return {
        id: child.id,
        name: child.categoryName,
        actions: (
          <UpdateCategoryButton
            content={<Pen className="h-4 w-4 hover:cursor-pointer" />}
            category={{
              ...child,
              categoryDescription: child.description,
              categoryName: child.categoryName,
              id: child.id,
              parentCategoryId: child.parentCategoryId,
            }}
          />
        ),
        children: formTree({
          id: child.id,
          name: child.categoryName,
          children: [],
        }), // Recursive call to form tree for each child
      };
    });
  }

  // Start building the tree from the root categories
  for (const rootCategory of rootCategories) {
    categoryTree.push({
      id: rootCategory.id,
      name: rootCategory.categoryName,
      actions: (
        <UpdateCategoryButton
          content={<Pen className="h-4 w-4 hover:cursor-pointer" />}
          category={{
            ...rootCategory,
            categoryDescription: rootCategory.description,
            categoryName: rootCategory.categoryName,
            id: rootCategory.id,
            parentCategoryId: rootCategory.parentCategoryId,
          }}
        />
      ),
      children: formTree({
        id: rootCategory.id,
        name: rootCategory.categoryName,
        children: [],
      }), // Recursively form the tree for each root category
    });
  }
  return (
    <div className="">
      <div className="flex items-center gap-2 text-lg font-semibold">
        Categories
        <div className="w-fit">
          <CreateCategoryButton />
        </div>
      </div>

      <p className="text my-2 text-muted-foreground">
        You can select a category to see related products
      </p>

      <div className="grid grid-cols-7 rounded border">
        <CategoryTree className="col-span-2 border-r" treeData={categoryTree} />
        <div className="col-span-5 w-full">
          <CategoryProduct />
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
