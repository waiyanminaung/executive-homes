"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openLocationPicker, type LocationSelection } from "@/components/@shared/LocationPickerDialog";
import FilterSelects, { type FilterSelectsProps } from "./FilterSelects";
import PropertyFilterDrawer from "./PropertyFilterDrawer";

interface PropertyFiltersProps extends FilterSelectsProps {
  search: string;
  onSearchChange: (v: string) => void;
  onLocationChange: (sel: LocationSelection) => void;
  onClear: () => void;
}

export default function PropertyFilters({
  search,
  onSearchChange,
  onLocationChange,
  onClear,
  ...filterProps
}: PropertyFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { typeId, status, listingType, availability, locationLabel } = filterProps;
  const activeCount = [typeId, status, listingType, availability, locationLabel].filter(Boolean).length;
  const hasActiveFilters = !!(search || activeCount);

  const handleLocationClick = () => openLocationPicker({ onApply: onLocationChange });
  const handleDrawerLocationClick = () => { setDrawerOpen(false); setTimeout(handleLocationClick, 150); };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 inline-flex items-center gap-2 w-full">
        <div className="w-56 shrink-0 flex-1">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search properties..."
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 min-w-0">
          <FilterSelects {...filterProps} onLocationClick={handleLocationClick} />
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className={classNames(
            "lg:hidden ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
            activeCount > 0
              ? "border-primary-300 bg-primary-50 text-primary-700"
              : "border-gray-200 text-gray-600 hover:bg-gray-50",
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="ml-auto lg:ml-0 flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      <PropertyFilterDrawer
        {...filterProps}
        open={drawerOpen}
        activeCount={activeCount}
        onClose={() => setDrawerOpen(false)}
        onClear={onClear}
        onLocationClick={handleDrawerLocationClick}
      />
    </>
  );
}
