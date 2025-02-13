"use client";

import { cn } from "@/app/_shared/lib/utils";
import { useQueryState } from "nuqs";
import SectionScrollLayout from "../SectionScrollLayout";

function TagQuery({
  tags,
}: {
  tags: {
    id: string;
    tagName: string;
  }[];
}) {
  const [
    selectedTagId,
    setSelectedTagId,
  ] = useQueryState("query-tag");

  return (
    <SectionScrollLayout className="flex w-full flex-col">
      {tags.map((t) => {
        {
          const isActive =
            selectedTagId == t.id;

          return (
            <div
              className={cn(
                isActive &&
                  "bg-foreground text-background",
                "flex w-full justify-start rounded p-2 text-left hover:cursor-pointer hover:bg-slate-100 hover:text-foreground",
              )}
              key={t.id}
              onClick={() => {
                if (!isActive) {
                  setSelectedTagId(
                    t.id,
                  );
                } else {
                  setSelectedTagId(
                    null,
                  );
                }
              }}
            >
              {t.tagName}
            </div>
          );
        }
      })}
    </SectionScrollLayout>
  );
}

export default TagQuery;
