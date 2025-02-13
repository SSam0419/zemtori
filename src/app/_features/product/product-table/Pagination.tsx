"use client";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useState, useTransition } from "react";

import { Button } from "@/app/_shared/components/ui/button";

function Pagination({ totalPages = 100 }: { totalPages?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [page, setPage] = useQueryState("page", parseAsInteger);
  const currentPage = page ?? 1;

  async function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages || isProcessing) return;

    try {
      setIsProcessing(true);

      startTransition(async () => {
        await setPage(newPage);
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  const isLoading = isProcessing || isPending;

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        type="button"
        variant="secondary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
      >
        <CircleChevronLeft />
      </Button>
      <div>
        {currentPage}/{totalPages}
      </div>
      <Button
        size="icon"
        type="button"
        variant="secondary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
      >
        <CircleChevronRight />
      </Button>
    </div>
  );
}

export default Pagination;
