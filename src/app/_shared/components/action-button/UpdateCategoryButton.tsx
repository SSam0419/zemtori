import React from "react";

import UpdateCategoryForm from "../form/category-form/UpdateCategoryForm";
import { Button } from "../ui/button";
import CreateActionButtonLayout from "./ActionButtonLayout";

export default function UpdateCategoryButton({
  content,
  category,
}: {
  content?: React.ReactNode;
  category: {
    id: string;
    categoryName: string;
    categoryDescription: string;
    parentCategoryId: string | null;
  };
}) {
  return (
    <CreateActionButtonLayout
      content={
        content ? (
          content
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            type="button"
          >
            Update Category
          </Button>
        )
      }
      dialogTitle="Update Category"
      FormComponent={UpdateCategoryForm}
      formProps={{ category }}
    />
  );
}
