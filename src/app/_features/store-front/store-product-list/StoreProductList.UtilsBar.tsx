"use client";

import SearchBar from "../SearchBar";
import StoreCategoryFilter from "../StoreCategoryFilter";

function UtilsBar({ storeId }: { storeId: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <SearchBar />
      <StoreCategoryFilter storeId={storeId} />
    </div>
  );
}

export default UtilsBar;
