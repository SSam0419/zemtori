"use client";

import { useParams } from "next/navigation";
import React from "react";

import TextBoard from "@/app/_shared/components/TextBoard";
import { Skeleton } from "@/app/_shared/components/ui/skeleton";
import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { useTagsQuery } from "@/app/_shared/hooks/queries/useTagsQuery";
import { useVariantValueQuery } from "@/app/_shared/hooks/queries/useVariantValueQuery";

import { useCreateProductCompleteMutation } from "./hooks/mutations/useCreateProductCompleteMutation";
import { useBasicProductInfoForm } from "./hooks/useBasicProductInfoForm";
import { useClassificationForm } from "./hooks/useClassificationForm";
import { useImagesForm } from "./hooks/useImagesForm";
import { useProductFormState } from "./hooks/useProductFormState";
import { useProductPricingForm } from "./hooks/useProductPricingForm";
import BasicProductInfoStep from "./steps/BasicProductInfoStep";
import ClassificationStep from "./steps/ClassificationStep";
import FinalStep from "./steps/FinalStep";
import ImagesStep from "./steps/ImagesStep";
import VariantsStep from "./steps/VariantsStep";

function MultiStepProductForm() {
  const { shopId } = useParams<{ shopId: string }>();

  const createProductCompleteMutation = useCreateProductCompleteMutation();

  const categoryQuery = useCategoryQuery(shopId);
  const tagQuery = useTagsQuery();
  const variantValueQuery = useVariantValueQuery(shopId);

  const { selectedFiles, previews, error, handleFileChange, handleRemoveImage } = useImagesForm();
  const { productPricing, updateProductPricing } = useProductPricingForm();
  const { currentStep, goToNextStep, goToPreviousStep } = useProductFormState();
  const {
    name,
    setName,
    description,
    setDescription,
    handleSubmit: handleSubmitStep1,
  } = useBasicProductInfoForm(goToNextStep);
  const {
    selectedCategory,
    selectedTags,
    updateSelectedTags,
    updateSelectedCategory,
    handleSubmit: handleSubmitStep2,
  } = useClassificationForm(goToNextStep);

  function renderCurrentStep() {
    switch (currentStep) {
      case 0:
        return (
          <BasicProductInfoStep
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            handleSubmit={handleSubmitStep1}
          />
        );
      case 1:
        if (categoryQuery.isLoading || tagQuery.isLoading) {
          return <Skeleton className="h-50 w-full" />;
        }

        if (categoryQuery.isError || tagQuery.isError) {
          return <div>Error loading data</div>;
        }

        return (
          <ClassificationStep
            categories={categoryQuery.data || []}
            tags={tagQuery.data || []}
            onPrevious={goToPreviousStep}
            categoryId={selectedCategory.id}
            selectedTags={selectedTags}
            updateSelectedTags={updateSelectedTags}
            updateSelectedCategory={updateSelectedCategory}
            handleSubmit={handleSubmitStep2}
          />
        );
      case 2:
        return (
          <VariantsStep
            variantValues={variantValueQuery.data || []}
            onSubmit={goToNextStep}
            onPrevious={goToPreviousStep}
            productPricing={productPricing}
            updateProductPricing={updateProductPricing}
          />
        );

      case 3:
        return (
          <ImagesStep
            onSubmit={goToNextStep}
            onPrevious={goToPreviousStep}
            selectedFiles={selectedFiles}
            previews={previews}
            error={error}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
          />
        );

      case 4:
        return (
          <FinalStep
            isLoading={createProductCompleteMutation.isPending}
            name={name}
            description={description}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            productPricing={productPricing}
            previews={previews}
            onPrevious={goToPreviousStep}
            handleSubmit={async () => {
              await createProductCompleteMutation.mutate({
                productName: name,
                description,
                categoryId: selectedCategory.id,
                tagIds: selectedTags.map((tag) => tag.id),
                productPricing: {
                  hasVariants: productPricing.hasVariants,
                  defaultPrice: productPricing.defaultPrice,
                  defaultStock: productPricing.defaultStock,
                  variants: productPricing.variants.map((variant) => {
                    return {
                      price: variant.price,
                      stock: variant.stock,
                      variantValues: variant.variantValues.map((variantValue) => {
                        return {
                          variantTypeId: variantValue.typeId,
                          variantValueId: variantValue.id,
                        };
                      }),
                    };
                  }),
                },
                productImages: selectedFiles,
              });
            }}
          />
        );

      default:
        return (
          <TextBoard type="error">
            Something Unexpected Happen! Refresh the page to see changes
          </TextBoard>
        );
    }
  }

  return <div>{renderCurrentStep()}</div>;
}

export default MultiStepProductForm;
