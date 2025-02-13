import { Store } from "lucide-react";
import React from "react";

function GeneralLoading() {
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center rounded bg-background p-10">
      <div className="flex items-end gap-2">
        <Store className="h-12 w-12" />
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default GeneralLoading;
