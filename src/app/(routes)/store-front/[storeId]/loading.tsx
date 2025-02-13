import React from "react";

import Spinner from "@/app/_shared/components/Spinner";

function Loading() {
  return (
    <div className="flex min-h-60 w-full items-center justify-center gap-2">
      <Spinner /> Loading
    </div>
  );
}

export default Loading;
