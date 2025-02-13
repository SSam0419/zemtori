import { useState } from "react";
import { ProductFormTypes } from "../types";

export function useBasicProductInfoForm(
  onSubmit: (
    data: ProductFormTypes.BasicInfo,
  ) => void,
) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();
    onSubmit({ name, description });
  }

  return {
    name,
    setName,
    description,
    setDescription,
    handleSubmit,
  };
}
