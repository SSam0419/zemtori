import { Badge } from "@/app/_shared/components/ui/badge";

interface Tag {
  tagId: string;
  tagName: string;
}

interface ProductTagsProps {
  tags: Tag[];
}

export function ProductTags({ tags }: ProductTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Badge key={tag.tagId} className="w-fit" variant="outline">
          {tag.tagName}
        </Badge>
      ))}
    </div>
  );
}
