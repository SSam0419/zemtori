"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/app/_shared/components/ui/dialog";

type CreateDialogButtonProps<T> = {
  content: React.ReactNode;
  dialogTitle: string;
  FormComponent: React.ComponentType<T & { onSuccess: () => void }>;
  formProps?: Omit<T, "onSuccess">;
  successCallback?: () => void;
};

export default function CreateActionButtonLayout<T>({
  content,
  dialogTitle,
  FormComponent,
  formProps,
  successCallback,
}: CreateDialogButtonProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{content}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <FormComponent
          onSuccess={() => {
            if (successCallback) successCallback();
            setOpen(false);
          }}
          {...(formProps as T)}
        />
      </DialogContent>
    </Dialog>
  );
}
