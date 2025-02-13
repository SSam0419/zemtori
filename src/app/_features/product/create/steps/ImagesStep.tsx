"use client";

import Image from "next/image";

import MultiPageFormLayout from "@/app/_shared/components/layout/form-layout/MultiPageFormLayout";
import TextBoard from "@/app/_shared/components/TextBoard";
import { Button } from "@/app/_shared/components/ui/button";

const MAX_IMAGES = 5; // Limit the number of images

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

export default function ImagesStep({
  onPrevious,
  onSubmit,
  previews,
  error,
  handleFileChange,
  handleRemoveImage,
}: {
  onPrevious: () => void;
  onSubmit: () => void;
  selectedFiles: File[];
  previews: string[];
  error: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}) {
  return (
    <MultiPageFormLayout.FormLayout currentStep={3} onSubmit={onSubmit}>
      <MultiPageFormLayout.FormInput
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
      />

      {/* Display error message if image limit exceeded */}
      {error && <TextBoard type="error">{error}</TextBoard>}

      {/* Display the uploaded image previews */}
      {previews.length > 0 && (
        <ImageGrid previews={previews} handleRemoveImage={handleRemoveImage} />
      )}

      <MultiPageFormLayout.FormNavigation onPrevious={onPrevious} />
    </MultiPageFormLayout.FormLayout>
  );
}
