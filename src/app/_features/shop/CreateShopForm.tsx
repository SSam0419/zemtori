"use client";
import React from "react";

import { Button } from "@/app/_shared/components/ui/button";
import { Input } from "@/app/_shared/components/ui/input";
import { Label } from "@/app/_shared/components/ui/label";
import { Textarea } from "@/app/_shared/components/ui/textarea";
import { useCreateShopMutation } from "@/app/_shared/hooks/mutations/useCreateShopMutation";

interface FormData {
  name: string;
  address: string;
  description: string;
}

function CreateShopForm() {
  const createShopMutation = useCreateShopMutation();
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    address: "",
    description: "",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createShopMutation.mutate(formData);
    } catch (error) {
      console.error("Error creating shop:", error);
    }
  }

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
      <div className="mb-4">
        <h1 className="leading-tight">Welcome</h1>
        <p className="text-sm leading-tight">{"Let's create your shop together!"}</p>
      </div>

      <div className="flex w-full flex-col">
        <Label htmlFor="name">
          <p className="text-base">What is the name of this exciting shop?</p>
        </Label>
        <Input
          disabled={createShopMutation.isPending || createShopMutation.isSuccess}
          id="name"
          name="name"
          required
          placeholder="Enter the name of your shop"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex w-full flex-col">
        <Label htmlFor="address">
          <p className="text-base">Where is this store based?</p>
        </Label>
        <Input
          disabled={createShopMutation.isPending || createShopMutation.isSuccess}
          id="address"
          name="address"
          required
          placeholder="The address/office of the shop customer can refer to"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex w-full flex-col">
        <Label htmlFor="description">
          <p className="text-base">Tell me more about this shop!</p>
        </Label>
        <Textarea
          disabled={createShopMutation.isPending || createShopMutation.isSuccess}
          id="description"
          name="description"
          required
          placeholder="Write a short description about this shop, e.g. what does it sell, what's so special about your shop"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      {createShopMutation.isError && (
        <p className="text-destructive">
          Failed to create shop: {createShopMutation.error.message}
        </p>
      )}

      {createShopMutation.isSuccess && (
        <p className="font-semibold text-green-500">
          CONGRATULATIONS! Your shop has been created successfully! 🎉
        </p>
      )}

      <Button
        type="submit"
        className="mt-6"
        disabled={createShopMutation.isPending || createShopMutation.isSuccess}
      >
        {createShopMutation.isPending ? "Creating..." : "Create Shop"}
      </Button>
    </form>
  );
}

export default CreateShopForm;
