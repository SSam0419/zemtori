import { ScrollArea } from "@/app/_shared/components/ui/scroll-area";
import { cn } from "@/app/_shared/lib/utils";
import React from "react";

function SectionScrollLayout({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollArea
      className={cn(
        "block h-[25rem] w-full",
        className,
      )}
    >
      {children}
    </ScrollArea>
  );
}

export default SectionScrollLayout;
