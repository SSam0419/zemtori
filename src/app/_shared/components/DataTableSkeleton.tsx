import { Skeleton } from "@/app/_shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_shared/components/ui/table";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  isHeaderVisible?: boolean;
}

export function DataTableSkeleton({
  columnCount = 6,
  rowCount = 10,
  isHeaderVisible = true,
}: DataTableSkeletonProps) {
  return (
    <div className="relative rounded-md border bg-background">
      <Table className="relative">
        {isHeaderVisible && (
          <TableHeader className="sticky top-0">
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-6 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
