"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";

import Spinner from "@/app/_shared/components/Spinner";
import { Input } from "@/app/_shared/components/ui/input";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedValue] = useDebounce(searchTerm, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    startTransition(() => {
      const queryString = createQueryString("q", debouncedValue);
      router.push(queryString ? `?${queryString}` : ".");
    });
  }, [debouncedValue, router, createQueryString]);

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`peer w-full ps-9 outline-none focus:ring-0 focus-visible:ring-0 ${isPending ? "bg-muted/50" : ""}`}
          disabled={isPending}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {isPending ? (
            <Spinner aria-hidden="true" />
          ) : (
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
