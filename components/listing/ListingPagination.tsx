"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { classNames } from "@/utils/classNames";

interface ListingPaginationProps {
  totalPages: number;
}

export function ListingPagination({ totalPages }: ListingPaginationProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => void setPage(p)}
          className={classNames(
            "flex h-[38px] w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors",
            page === p
              ? "border-secondary-900 bg-secondary-900 text-white"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
