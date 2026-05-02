"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onChange: (page: number) => void;
}

export const HomePagination = ({
  currentPage,
  totalPages,
  isLoading,
  onChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={classNames("mt-16 flex items-center justify-center gap-3")}>
      <Button
        type="button"
        variant="icon"
        disabled={currentPage === 1 || isLoading}
        onClick={() => onChange(currentPage - 1)}
        className={classNames(
          "p-3 bg-card border border-white/5 rounded-xl",
          "disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5",
          "transition-all",
        )}
      >
        <ChevronLeft className={classNames("w-5 h-5")} />
      </Button>

      <div className={classNames("flex items-center gap-2")}>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;

          if (totalPages > 7) {
            if (
              pageNumber !== 1 &&
              pageNumber !== totalPages &&
              Math.abs(pageNumber - currentPage) > 1
            ) {
              if (pageNumber === 2 || pageNumber === totalPages - 1) {
                return (
                  <span
                    key={`ellipsis-${pageNumber}`}
                    className={classNames("text-white/20 px-1")}
                  >
                    ...
                  </span>
                );
              }
              return null;
            }
          }

          return (
            <Button
              key={`page-${pageNumber}`}
              type="button"
              onClick={() => onChange(pageNumber)}
              className={classNames(
                "w-10 h-10 rounded-xl text-xs font-black transition-all",
                currentPage === pageNumber
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-card text-white/40 border border-white/5 hover:bg-white/5",
              )}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="icon"
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onChange(currentPage + 1)}
        className={classNames(
          "p-3 bg-card border border-white/5 rounded-xl",
          "disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5",
          "transition-all",
        )}
      >
        <ChevronRight className={classNames("w-5 h-5")} />
      </Button>
    </div>
  );
};
