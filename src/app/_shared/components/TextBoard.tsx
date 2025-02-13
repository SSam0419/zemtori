import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import React from "react";

import { cn } from "@/app/_shared/lib/utils";

function TextBoard({
  type,
  children,
  className,
}: {
  type: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  switch (type) {
    case "success":
      return (
        <p
          className={cn(
            "flex items-center gap-2 rounded bg-green-200 p-2 text-xs text-green-700",
            className,
          )}
        >
          <CircleCheck />
          {children}
        </p>
      );
    case "warning":
      return (
        <p
          className={cn(
            "flex items-center gap-2 rounded bg-yellow-200 p-2 text-xs text-yellow-700",
            className,
          )}
        >
          <TriangleAlert />
          {children}
        </p>
      );
    case "error":
      return (
        <p
          className={cn(
            "flex items-center gap-2 rounded bg-rose-200 p-2 text-xs text-rose-700",
            className,
          )}
        >
          <CircleX />
          {children}
        </p>
      );
    case "info":
      return (
        <p
          className={cn(
            "flex items-center gap-2 rounded bg-blue-200 p-2 text-xs text-blue-700",
            className,
          )}
        >
          <Info /> {children}
        </p>
      );
  }
}

export default TextBoard;
