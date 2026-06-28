"use client";

import { MapPin, Train, Building2 } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import type { SearchResult } from "@/utils/usePropertySearch";

interface PropertySearchDropdownProps {
  pos: { top: number; left: number; width: number };
  onProvinceClick: () => void;
  onTransitClick: () => void;
  onResultClick: (result: SearchResult) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  results?: SearchResult[];
  loading?: boolean;
}

export function PropertySearchDropdown({
  pos,
  onProvinceClick,
  onTransitClick,
  onResultClick,
  dropdownRef,
  results,
  loading,
}: PropertySearchDropdownProps) {
  const hasQuery = results !== undefined;

  return (
    <div
      ref={dropdownRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      {hasQuery ? (
        loading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner className="h-5 w-5 text-primary-500" />
          </div>
        ) : results.length === 0 ? (
          <p className="px-4 py-4 text-sm text-gray-400">No results found</p>
        ) : (
          <ul>
            {results.map((result, i) => (
              <li key={result.id}>
                {i > 0 && <div className="mx-4 border-t border-gray-100" />}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onResultClick(result)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    {result.type === "station" ? (
                      <Train className="h-4 w-4 text-primary-500" />
                    ) : (
                      <Building2 className="h-4 w-4 text-gray-500" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">{result.name}</span>
                    {result.description && (
                      <span className="block truncate text-xs text-gray-500">{result.description}</span>
                    )}
                  </span>

                  <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
                    {result.badge}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onProvinceClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MapPin className="h-4 w-4 shrink-0 text-primary-500" />
            Search by Province
          </button>
          <div className="mx-4 border-t border-gray-100" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onTransitClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Train className="h-4 w-4 shrink-0 text-primary-500" />
            Search by BTS/MRT
          </button>
        </>
      )}
    </div>
  );
}
