"use client";
import { Pencil } from "lucide-react";
import React from "react";

import { Badge } from "@/app/_shared/components/ui/badge";
import { BorderBeam } from "@/app/_shared/components/ui/border-beam";
import { Button } from "@/app/_shared/components/ui/button";

function EditFormLayout({
  EditComponent,
  ViewComponent,
  isEditing,
  setIsEditing,
  canProductBeEdited,
}: {
  canProductBeEdited: boolean;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  EditComponent: React.ReactNode;
  ViewComponent: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Badge className={"absolute -top-3 left-2 z-30"} variant={"secondary"}>
        {isEditing ? "Edit Mode" : "View Mode"}
      </Badge>
      <div className={"relative h-full max-w-full overflow-hidden rounded border p-4"}>
        {!isEditing && ViewComponent}
        {isEditing && EditComponent}
        <div className="absolute right-0 top-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (canProductBeEdited) setIsEditing((prev) => !prev);
            }}
          >
            <Pencil className="size-4" />
          </Button>
        </div>
        {isEditing && <BorderBeam size={250} duration={12} delay={9} />}
      </div>
    </div>
  );
}

export default EditFormLayout;
