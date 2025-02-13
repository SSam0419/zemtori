import {
  useState,
  useEffect,
} from "react";

export function useImagesForm() {
  const MAX_IMAGES = 5; // Limit the number of images

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<File[]>([]);
  const [previews, setPreviews] =
    useState<string[]>([]);
  const [error, setError] = useState<
    string | null
  >(null); // Error state for image limit

  // Handle file input change and generate previews
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (files) {
      const fileArray =
        Array.from(files); // Convert FileList to an array

      // Check if adding new images exceeds the limit
      if (
        selectedFiles.length +
          fileArray.length >
        MAX_IMAGES
      ) {
        setError(
          `You can upload a maximum of ${MAX_IMAGES} images.`,
        );
        return;
      }

      setError(null); // Reset error if the new selection is valid

      const newSelectedFiles = [
        ...selectedFiles,
        ...fileArray,
      ];
      setSelectedFiles(
        newSelectedFiles,
      );

      const newPreviews = fileArray.map(
        (file) =>
          URL.createObjectURL(file),
      );
      setPreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);

      // Clear the file input value after each change to allow re-upload of the same files
      event.target.value = "";
    }
  }

  // Clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      previews.forEach((preview) =>
        URL.revokeObjectURL(preview),
      );
    };
  }, [previews]);

  // Remove a specific image by index
  function handleRemoveImage(
    index: number,
  ) {
    // Revoke the object URL when an image is removed
    URL.revokeObjectURL(
      previews[index],
    );

    const updatedFiles =
      selectedFiles.filter(
        (_, i) => i !== index,
      );
    const updatedPreviews =
      previews.filter(
        (_, i) => i !== index,
      );

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  }

  return {
    selectedFiles,
    previews,
    error,
    handleFileChange,
    handleRemoveImage,
  };
}
