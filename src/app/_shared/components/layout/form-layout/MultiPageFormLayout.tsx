import React from "react";

import { Button } from "@/app/_shared/components/ui/button";

import { FormInput, FormMultiSelect, FormSelect, FormTextarea } from "./FormLayout";

function FormLayout({
  children,
  currentStep,
  onSubmit,
  isDisabled,
}: {
  isDisabled?: boolean;
  children: React.ReactNode;
  currentStep: 0 | 1 | 2 | 3;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex flex-col rounded bg-background p-10">
      {currentStep == 0 && (
        <div className="my-4 text-sm">
          <span className="text-lg">product description</span>
          <span className="text-muted-foreground">
            {" > category & tags > pricing > image uploads"}
          </span>
        </div>
      )}
      {currentStep == 1 && (
        <div className="my-4 text-sm">
          <span className="text-muted-foreground">product description</span>
          <span className="text-lg">{" > category & tags"}</span>
          <span className="text-muted-foreground">{" > pricing > image uploads"}</span>
        </div>
      )}
      {currentStep == 2 && (
        <div className="my-4 text-sm">
          <span className="text-muted-foreground">product description</span>
          <span className="text-muted-foreground">{" > category & tags > pricing"}</span>
          <span className="text-lg">{" > image uploads"}</span>
        </div>
      )}
      {currentStep == 3 && (
        <div className="my-4 text-sm">
          <span className="text-muted-foreground">product description</span>
          <span className="text-muted-foreground">{" > category & tags > pricing"}</span>
          <span className="text-muted-foreground">{" > image uploads"}</span>
        </div>
      )}

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isDisabled) onSubmit(e);
          console.log("Form Submitted");
        }}
      >
        {children}
      </form>
    </div>
  );
}

function FormNavigation({ onPrevious }: { onPrevious?: () => void }) {
  if (!onPrevious) {
    return (
      <Button type="submit" className="w-full">
        Next
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" onClick={onPrevious} className="w-full" variant="outline">
        Back
      </Button>
      <Button type="submit" className="w-full">
        Next
      </Button>
    </div>
  );
}

const MultiPageFormLayout = {
  FormLayout,
  FormInput,
  FormTextarea,
  FormSelect,
  FormMultiSelect,
  FormNavigation,
};
export default MultiPageFormLayout;
