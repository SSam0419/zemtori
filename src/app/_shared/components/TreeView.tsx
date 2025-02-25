"use client";

import React from "react";

import { cn } from "@/app/_shared/lib/utils";
import { Button } from "./ui/button";

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
  //const hasChildren = item.children ? item.children?.length > 0 : 0;

  return (
    <div
    >
      <Button
        size={"sm"}
        variant={isSelected ? "default" : "ghost"}
        onClick={() => onSelect && onSelect(item)}
        className={cn(
          "w-full justify-start",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1 rounded",
            isSelected && "bg-foreground text-background",
          )}
        >
          {item.icon}
          <span className="flex-grow truncate text-sm">{item.name}</span>
          {isSelected && <div className="ml-2">{item.actions}</div>}
        </div>
      </Button>
      <div className="ml-4 pl-1 border-l-2">
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
      </div>
    </div>
  );
}
