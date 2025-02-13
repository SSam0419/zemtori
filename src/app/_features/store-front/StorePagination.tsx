"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_shared/components/ui/pagination";

function StorePagination({ totalPage, currentPage }: { totalPage: number; currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }

  function renderPageNumbers() {
    const items = [];
    const showEllipsis = totalPage > 7;

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Complex pagination with ellipsis
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPage, startPage + 4);

      // Adjust when near the end
      if (endPage === totalPage) {
        startPage = Math.max(1, endPage - 4);
      }

      // First page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={1 === currentPage}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // First ellipsis
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationLink className="cursor-default">...</PaginationLink>
          </PaginationItem>,
        );
      }

      // Middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPage) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => handlePageChange(i)} isActive={i === currentPage}>
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      // Last ellipsis
      if (endPage < totalPage - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationLink href="#" className="cursor-default">
              ...
            </PaginationLink>
          </PaginationItem>,
        );
      }

      // Last page
      if (totalPage !== 1) {
        items.push(
          <PaginationItem key={totalPage}>
            <PaginationLink
              onClick={() => handlePageChange(totalPage)}
              isActive={totalPage === currentPage}
            >
              {totalPage}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={currentPage === totalPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default StorePagination;
