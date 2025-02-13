import { GetImageAttachedPricing } from "@/app/_server/admin-actions/resources/product-image/get-image-attached-pricing";
import { QueryClient, useQuery } from "@tanstack/react-query";

//get which pricing is attached to this image
export function useImageAttachmentQuery({ imageId }: { imageId: string }) {
  return useQuery({
    queryFn: async () => await GetImageAttachedPricing({ imageId }),
    queryKey: ["image-attachment", imageId],
  });
}

const queryClient = new QueryClient();
export function invalidateImageAttachmentQuery({ imageId }: { imageId: string }) {
  queryClient.invalidateQueries({
    queryKey: ["image-attachment", imageId],
  });
}
