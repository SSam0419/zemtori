"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";

import Spinner from "@/app/_shared/components/Spinner";
import { Button } from "@/app/_shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_shared/components/ui/popover";
import { useCategoryQuery } from "@/app/_shared/hooks/queries/useCategoryQuery";
import { cn } from "@/app/_shared/lib/utils";

interface Category {
  id: string;
  categoryName: string;
  description: string;
  parentCategoryId: string | null;
}

interface StoreCategoryFilterProps {
  storeId: string;
}

function StoreCategoryFilter({ storeId }: StoreCategoryFilterProps) {
  const [selectedCategoryId] = useQueryState("category");
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const { data: categories, isLoading, isError } = useCategoryQuery(storeId);

  const allCategories = categories || [];
  const rootCategories = allCategories.filter((category) => category.parentCategoryId === null);

  function setCategoryFilter(categoryId: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.set("category", categoryId);
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function clearCategoryFilter() {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("category");
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function renderCategoryButton(category: Category) {
    const isSelected = selectedCategoryId === category.id;
    const isRoot = category.parentCategoryId === null;
    return (
      <Button
        key={category.id}
        disabled={isPending}
        variant={"link"}
        onClick={() => setCategoryFilter(category.id)}
        className={cn(isSelected && "underline", "h-fit")}
      >
        <div className={cn(!isRoot && "pl-3", "relative flex h-fit items-center")}>
          {!isRoot && (
            <div className="absolute -top-1 left-0 h-4 w-2 rounded-bl border-b border-l"></div>
          )}

          {category.categoryName}
        </div>
      </Button>
    );
  }

  function renderCategoryChildColumn(categories: Category[]) {
    return (
      <div className="flex flex-col items-start">
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            {renderCategoryButton(category)}
            <div className="ml-4 flex flex-col border-l">
              {renderCategoryChildColumn(
                allCategories.filter((c) => c.parentCategoryId === category.id),
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  function renderAllCategorySelector() {
    return (
      <div className="relative my-1 flex flex-wrap items-start gap-2">
        {rootCategories.map((category) => (
          <div key={category.id} className="flex flex-col items-start rounded bg-muted p-1">
            {renderCategoryButton(category)}
            <div className="ml-4">
              {renderCategoryChildColumn(
                allCategories.filter((c) => c.parentCategoryId === category.id),
              )}
            </div>
          </div>
        ))}
        {isPending && <LoadingOverlay />}
      </div>
    );
  }

  function LoadingOverlay() {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div className="my-4 w-full border p-6">Failed to load categories</div>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button">
          {selectedCategoryId
            ? allCategories.find((c) => c.id === selectedCategoryId)?.categoryName
            : "All Categories"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit">
        <div className="flex w-full items-center justify-between border-b py-1 font-medium">
          <p>Categories</p>
          <Button
            type="button"
            onClick={clearCategoryFilter}
            className="text-sm"
            size="sm"
            variant="outline"
          >
            Reset Filter
          </Button>
        </div>

        {isLoading && <Spinner />}
        {!isLoading && !rootCategories.length && <div>No categories found</div>}

        {renderAllCategorySelector()}
      </PopoverContent>
    </Popover>
  );
}

export default StoreCategoryFilter;
