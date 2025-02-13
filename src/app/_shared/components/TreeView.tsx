"use client";

import { ChevronRight, Minus } from "lucide-react";
import React, { useState } from "react";

// import * as Accordion from "@radix-ui/react-accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_shared/components/ui/collapsible";
import { cn } from "@/app/_shared/lib/utils";

export interface TreeItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: TreeItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

interface TreeViewProps {
  data: TreeItem[] | TreeItem;
  selectedId?: string;
  onSelect?: (item?: TreeItem) => void;
  expandAll?: boolean;
  className?: string;
}

export function TreeView({ data, selectedId, onSelect, expandAll, className }: TreeViewProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <div className={cn("p-2", className)}>
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          selectedId={selectedId}
          onSelect={onSelect}
          level={0}
          expandAll={expandAll}
        />
      ))}
    </div>
  );
}

function TreeNode({
  item,
  selectedId,
  onSelect,
  level,
  expandAll,
}: {
  item: TreeItem;
  selectedId?: string;
  onSelect?: (item?: TreeItem) => void;
  level: number;
  expandAll?: boolean;
}) {
  const isSelected = item.id === selectedId;
  const hasChildren = item.children ? item.children?.length > 0 : 0;
  const [, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={true}
      onOpenChange={setIsOpen}
      className="group/collapsible [&[data-state=open]>button>svg#chevron]:rotate-90"
    >
      <CollapsibleTrigger
        onClick={() => onSelect && onSelect(item)}
        className={cn(
          "w-full",
          isSelected && "bg-foreground text-background hover:bg-foreground hover:text-background",
        )}
        asChild
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded px-4 py-2 hover:bg-slate-100 hover:text-foreground",
            isSelected && "bg-foreground text-background hover:bg-foreground hover:text-background",
          )}
        >
          {hasChildren ? (
            <ChevronRight className="h-4 w-4 transition-transform" id="chevron" />
          ) : (
            <Minus className="h-4 w-4 transition-transform" />
          )}
          {item.icon}
          <span className="flex-grow truncate text-sm">{item.name}</span>
          {isSelected && <div className="ml-2">{item.actions}</div>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-2">
        {item.children?.map((child) => (
          <TreeNode
            key={child.id}
            item={child}
            selectedId={selectedId}
            onSelect={onSelect}
            level={level + 1}
            expandAll={expandAll}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
