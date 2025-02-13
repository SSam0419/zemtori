import React from "react";
import CreateCategoryForm from "../form/category-form/CreateCategoryForm";
import CreateActionButtonLayout from "./ActionButtonLayout";
import { Button } from "../ui/button";

export default function CreateCategoryButton({
  content,
}: {
  content?: React.ReactNode;
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
            Create Category
          </Button>
        )
      }
      dialogTitle="New Category"
      FormComponent={CreateCategoryForm}
    />
  );
}
