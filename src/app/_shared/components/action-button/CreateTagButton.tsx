import React from "react";
import CreateTagForm from "../form/tag-form/CreateTagForm";
import CreateActionButtonLayout from "./ActionButtonLayout";
import { Button } from "../ui/button";

export default function CreateTagButton({
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
            Create Tag
          </Button>
        )
      }
      dialogTitle="New Tag"
      FormComponent={CreateTagForm}
    />
  );
}
