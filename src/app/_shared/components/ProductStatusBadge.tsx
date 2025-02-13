import React from "react";

import { TProductStatus } from "../types/global-types";

function ProductStatusBadge({ status }: { status: TProductStatus }) {
  if (status === "DRAFT") {
    return <div className="rounded-full border px-4 py-1 text-center">Draft</div>;
  }
  if (status === "PUBLISHED") {
    return (
      <div className="rounded-full bg-green-100 px-4 py-1 text-center text-green-700">
        Published
      </div>
    );
  }

  if (status === "ARCHIVED") {
    return (
      <div className="rounded-full bg-orange-100 px-4 py-1 text-center text-orange-700">
        Archived
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="rounded-full bg-slate-100 px-4 py-1 text-center text-slate-700">Pending</div>
    );
  }

  return <div>{status}</div>;
}

export default ProductStatusBadge;
