"use client";

import CreateTagButton from "@/app/_shared/components/action-button/CreateTagButton";

import TagProduct from "./TagSection.TagProduct";
import TagQuery from "./TagSection.TagQuery";

function TagSection({
  tags,
}: {
  tags: {
    id: string;
    tagName: string;
  }[];
}) {
  return (
    <div className="">
      <div className="flex items-center gap-2 text-lg font-semibold">
        Tags
        <div className="w-fit">
          <CreateTagButton />
        </div>
      </div>

      <p className="text my-2 text-muted-foreground">
        You can select a tag to see related products
      </p>

      <div className="grid grid-cols-7 rounded border">
        <div className="col-span-2 flex flex-col items-start border-r p-4">
          <TagQuery tags={tags} />
        </div>
        <div className="col-span-5 h-full w-full">
          <TagProduct />
        </div>
      </div>
    </div>
  );
}

export default TagSection;
