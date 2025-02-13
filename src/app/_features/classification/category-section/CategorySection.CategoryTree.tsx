"use client";
import { useQueryState } from "nuqs";

import { TreeItem, TreeView } from "@/app/_shared/components/TreeView";

import SectionScrollLayout from "../SectionScrollLayout";

function CategoryTree({ className, treeData }: { className?: string; treeData: TreeItem[] }) {
  const [selectedCategoryId, setSelectedCategoryId] = useQueryState("query-category");

  return (
    <SectionScrollLayout className={className}>
      <TreeView
        onSelect={(selected) => {
          if (selected) setSelectedCategoryId(selected.id);
        }}
        data={treeData}
        selectedId={selectedCategoryId || undefined}
      />
    </SectionScrollLayout>
  );
}

export default CategoryTree;
