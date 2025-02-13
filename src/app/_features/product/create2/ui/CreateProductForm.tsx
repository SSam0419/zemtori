"use client";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

import { CreateVariantPricing } from "@/app/_server/admin-actions/resources/variant-pricing/create-variant-pricing";
import CreateCategoryButton from "@/app/_shared/components/action-button/CreateCategoryButton";
import CreateTagButton from "@/app/_shared/components/action-button/CreateTagButton";
import CreateVariantValueButton from "@/app/_shared/components/action-button/CreateVariantValueButton";
import * as FormLayout from "@/app/_shared/components/layout/form-layout/FormLayout";
import TextBoard from "@/app/_shared/components/TextBoard";
import { Badge } from "@/app/_shared/components/ui/badge";
import { Button } from "@/app/_shared/components/ui/button";

import { useCreateProductCompleteMutation } from "../../create/hooks/mutations/useCreateProductCompleteMutation";
import { useProductForm } from "../hook/useProductFormState";

function CreateProductForm() {
  const {
    name,
    setName,
    description,
    setDescription,
    categoryQuery,
    tagQuery,
    variantValueQuery,
    productPricing,
    selectedCategory,
    selectedTags,
    selectedFiles,
    previews,
    handleFileChange,
    handleRemoveImage,
    updateSelectedCategory,
    updateSelectedTags,
    updateProductPricing,
    error,
  } = useProductForm();

  const createProductCompleteMutation = useCreateProductCompleteMutation();

  return (
    <FormLayout.FormLayout
      isDisabled={
        createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
      }
      className="py-2"
      onSubmit={() => {
        const confirm = window.confirm("Are you sure you want to create this product?");
        if (!confirm) return;

        createProductCompleteMutation.mutate({
          productName: name,
          description,
          categoryId: selectedCategory?.id,
          tagIds: selectedTags.map((t) => t.id),
          productImages: selectedFiles,
          productPricing: {
            ...productPricing,
            variants: productPricing.variants.map((v) => ({
              variantValues: v.variantValues.map((vv) => ({
                variantValueId: vv.id,
                variantTypeId: vv.typeId,
              })),
              price: v.price,
              stock: v.stock,
            })),
          },
        });
      }}
    >
      <h1>New Product</h1>

      <FormSectionWrapper title="Product Classification">
        <FormLayout.FormSelect
          formName="category"
          options={
            categoryQuery.data?.map((cate) => ({
              value: cate.id,
              label: cate.categoryName,
            })) || []
          }
          value={selectedCategory ? selectedCategory.id : undefined}
          onValueChange={(value) => updateSelectedCategory(value as string)}
          label="Category"
          isDisabled={
            categoryQuery.isLoading ||
            createProductCompleteMutation.isPending ||
            createProductCompleteMutation.isSuccess
          }
          action={<CreateCategoryButton />}
          isRequired
        />
        <FormLayout.FormMultiSelect
          formName="tags"
          label="Tags"
          action={<CreateTagButton />}
          options={
            tagQuery.data?.map((tag) => ({
              value: tag.id,
              label: tag.tagName,
            })) || []
          }
          value={selectedTags.map((t) => ({
            value: t.id,
            label: t.tag,
          }))}
          onValueChange={(value) =>
            updateSelectedTags(value.map((v) => ({ id: v.value, tag: v.label })))
          }
          placeholder="Select tags"
          isDisabled={
            tagQuery.isLoading ||
            createProductCompleteMutation.isPending ||
            createProductCompleteMutation.isSuccess
          }
        />
      </FormSectionWrapper>
      <FormSectionWrapper title="Product Details">
        <FormLayout.FormInput
          label="Name"
          formName="name"
          type="text"
          placeholder="Enter product name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          isRequired
          isDisabled={
            createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
          }
        />
        <FormLayout.FormTextarea
          label="Description"
          formName="description"
          placeholder="what is this product about?"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          isRequired
          isDisabled={
            createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
          }
        />
      </FormSectionWrapper>

      {/* Image Section */}
      <FormSectionWrapper title="Product Assets">
        <FormLayout.FormInput
          type="file"
          formName="images"
          onChange={handleFileChange}
          isRequired={false}
          label="Upload Images"
          description={`Upload up to ${MAX_IMAGES} images`}
          placeholder="Upload images"
          value="" // Reset the value to allow re-uploads of the same files
          multiple // Allow multiple file selection
          accept="image/*" // Accept only image files
          isDisabled={
            selectedFiles.length >= MAX_IMAGES ||
            createProductCompleteMutation.isPending ||
            createProductCompleteMutation.isSuccess
          }
        />

        {/* Display error message if image limit exceeded */}
        {error && <TextBoard type="error">{error}</TextBoard>}

        {/* Display the uploaded image previews */}
        {previews.length > 0 && (
          <ImageGrid previews={previews} handleRemoveImage={handleRemoveImage} />
        )}
      </FormSectionWrapper>

      {/* Variant Section */}
      <FormSectionWrapper title="Product Pricing">
        <FormLayout.FormSelect
          formName="hasVariants"
          label="Does this product have variants?"
          action={productPricing.hasVariants ? <CreateVariantValueButton /> : undefined}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          onValueChange={(val) => {
            updateProductPricing({
              ...productPricing,
              hasVariants: val === "yes",
            });
          }}
          value={productPricing.hasVariants ? "yes" : "no"}
          isDisabled={
            createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
          }
        />
        {!productPricing.hasVariants && (
          <>
            <FormLayout.FormInput
              formName="defaultPrice"
              label="Default Price"
              value={productPricing.defaultPrice.toString()}
              onChange={(e) =>
                updateProductPricing({
                  ...productPricing,
                  defaultPrice: Number(e.target.value),
                })
              }
              placeholder="Default Price"
              isDisabled={
                createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
              }
            />
            <FormLayout.FormInput
              formName="defaultStock"
              label="Default Stock"
              value={productPricing.defaultStock.toString()}
              onChange={(e) =>
                updateProductPricing({
                  ...productPricing,
                  defaultStock: Number(e.target.value),
                })
              }
              placeholder="Default Stock"
              isDisabled={
                createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
              }
            />
          </>
        )}
        {productPricing.hasVariants && (
          <>
            <div className="grid w-full grid-cols-12 items-center gap-2">
              <p className="col-span-7">Variant Combination</p>
              <p className="col-span-2">Price</p>
              <p className="col-span-2">Stock</p>
              <p className="col-span-1 flex items-center justify-center">Actions</p>
            </div>

            {productPricing.variants.map((variant, index) => (
              <div key={index} className="flex w-full items-center justify-center">
                <div className="grid w-full grid-cols-12 items-center gap-2">
                  <div className="col-span-7">
                    <FormLayout.FormMultiSelect
                      isDisabled={
                        createProductCompleteMutation.isPending ||
                        createProductCompleteMutation.isSuccess
                      }
                      formName={`variants[${index}].variantValueIds`}
                      options={
                        variantValueQuery.data?.map((v) => ({
                          label: `${v.typeName} : ${v.variantValueName}`,
                          value: `${v.id}-%-${v.variantTypeId}`,
                          disabled:
                            variant.variantValues.find((vv) => vv.typeId === v.variantTypeId) &&
                            v.id !==
                              variant.variantValues.find((vv) => vv.typeId === v.variantTypeId)?.id,
                        })) || []
                      }
                      value={variant.variantValues.map((v) => ({
                        label: `${v.typeName} : ${v.valueName}`,
                        value: `${v.id}-%-${v.typeId}`,
                      }))}
                      onValueChange={(val) => {
                        const typeIds = val.map((v) => v.value.split("-%-")[1]);
                        val = val.slice(0, typeIds.length);
                        if (val.length !== typeIds.length) {
                          console.log("Duplicate values found");
                          return alert("Duplicate values found");
                        }

                        const updatedVariantValues = val.map((v) => {
                          const [id, typeId] = v.value.split("-%-");
                          return {
                            id,
                            typeId,
                            typeName:
                              variantValueQuery.data?.find((vv) => vv.id === id)?.typeName || "",
                            valueName:
                              variantValueQuery.data?.find((vv) => vv.id === id)
                                ?.variantValueName || "",
                          };
                        });

                        updateProductPricing({
                          ...productPricing,
                          variants: productPricing.variants.map((v, i) =>
                            i === index
                              ? {
                                  ...v,
                                  variantValues: updatedVariantValues,
                                }
                              : v,
                          ),
                        });
                      }}
                      placeholder="Select Variant Values"
                    />
                  </div>

                  <div className="col-span-2">
                    <FormLayout.FormInput
                      isDisabled={
                        createProductCompleteMutation.isPending ||
                        createProductCompleteMutation.isSuccess
                      }
                      formName={`variants[${index}].price`}
                      value={variant.price.toString()}
                      onChange={(e) =>
                        updateProductPricing({
                          ...productPricing,
                          variants: productPricing.variants.map((v, i) =>
                            i === index
                              ? {
                                  ...v,
                                  price: Number(e.target.value),
                                }
                              : v,
                          ),
                        })
                      }
                      placeholder="Price"
                    />
                  </div>

                  <div className="col-span-2">
                    <FormLayout.FormInput
                      isDisabled={
                        createProductCompleteMutation.isPending ||
                        createProductCompleteMutation.isSuccess
                      }
                      formName={`variants[${index}].stock`}
                      value={variant.stock.toString()}
                      onChange={(e) =>
                        updateProductPricing({
                          ...productPricing,
                          variants: productPricing.variants.map((v, i) =>
                            i === index
                              ? {
                                  ...v,
                                  stock: Number(e.target.value),
                                }
                              : v,
                          ),
                        })
                      }
                      placeholder="Stock"
                    />
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      variant="destructive"
                      type="button"
                      onClick={() => {
                        updateProductPricing({
                          ...productPricing,
                          variants: productPricing.variants.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              className="mt-2 w-full"
              variant="secondary"
              onClick={() => {
                updateProductPricing({
                  ...productPricing,
                  variants: [
                    ...productPricing.variants,
                    {
                      variantValues: [],
                      price: 0,
                      stock: 0,
                    },
                  ],
                });
              }}
            >
              New Variant Option
            </Button>
          </>
        )}
      </FormSectionWrapper>

      <FormLayout.FormSubmitButton
        isLoading={createProductCompleteMutation.isPending}
        isDisabled={
          createProductCompleteMutation.isPending || createProductCompleteMutation.isSuccess
        }
      />
    </FormLayout.FormLayout>
  );
}

export default CreateProductForm;

const MAX_IMAGES = 5; // Limit the number of images

function FormSectionWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative my-2 space-y-2 rounded-lg border bg-background px-2 py-4 shadow">
      <Badge className="absolute -top-3 rounded" variant={"default"}>
        {title}
      </Badge>
      {children}
    </div>
  );
}

function ImageGrid({
  previews,
  handleRemoveImage,
}: {
  previews: string[];
  handleRemoveImage: (index: number) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {previews.map((preview, index) => (
        <div key={index} className="relative border-2 border-dashed p-1">
          <Image
            src={preview}
            alt={`Uploaded image ${index + 1}`}
            width={250}
            height={250}
            className="object-contain"
          />
          <Button
            variant="ghost"
            className="absolute right-1 top-1 text-destructive"
            onClick={() => handleRemoveImage(index)}
            aria-label={`Remove image ${index + 1}`}
          >
            ✕
          </Button>
        </div>
      ))}
    </div>
  );
}
