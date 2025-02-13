"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { useCallback, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import Spinner from "@/app/_shared/components/Spinner";
import { Input } from "@/app/_shared/components/ui/input";
import { useCustomToast } from "@/app/_shared/hooks/useCustomToast";

interface SearchQueryProps {
  placeholder?: string;
  className?: string;
  maxLength?: number;
  minLength?: number;
  debounceMs?: number;
}

function SearchQuery({
  placeholder = "Search products by name...",
  className = "",
  maxLength = 100,
  minLength = 2,
  debounceMs = 1000,
}: SearchQueryProps) {
  const { toastWarning } = useCustomToast();
  const [query, setQuery] = useQueryState("query", { defaultValue: "" });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("query", value);
        params.set("page", "1");
      } else {
        params.delete("query");
      }
      return params;
    },
    [searchParams],
  );

  const handleSearch = useDebouncedCallback(async (value: string) => {
    if (value && value.length < minLength) {
      toastWarning(`Search term must be at least ${minLength} characters`);
      return;
    }
    setIsSearching(true);
    startTransition(() => {
      (async () => {
        try {
          const params = updateSearchParams(value);
          replace(`${pathname}?${params.toString()}`);
        } catch (error) {
          console.error("Search error:", error);
          toastWarning("Failed to update search results");
        } finally {
          setIsSearching(false);
        }
      })();
    });
  }, debounceMs);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length > maxLength) return;

      setQuery(value);

      handleSearch(value);
    },
    [handleSearch, maxLength, setQuery],
  );

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {isSearching ? (
          <div className="absolute left-2.5 top-3">
            <Spinner className="h-4 w-4" />
          </div>
        ) : (
          <Search
            className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        )}

        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8 pr-10"
          value={query || ""}
          onChange={handleChange}
          maxLength={maxLength}
          aria-label="Search products"
          disabled={isSearching}
        />
      </div>
    </div>
  );
}

export default SearchQuery;
