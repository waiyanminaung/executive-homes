"use client";

import { useRef, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, MapPin } from "lucide-react";
import { Input, Switch, Select, SelectOption, useClickOutside, Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openLocationPicker, type LocationSelection } from "@/components/@shared/LocationPickerDialog";
import type { FilterSelectsProps } from "./FilterSelects";

interface PropertyFiltersProps extends FilterSelectsProps {
  search: string;
  onSearchChange: (v: string) => void;
  onLocationChange: (sel: LocationSelection) => void;
  onClear: () => void;
}

interface FilterRowProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function FilterRow({ label, active, onToggle }: FilterRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span
        className={classNames(
          "text-sm font-medium px-2.5 py-1 rounded-md",
          active ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600",
        )}
      >
        {label}
      </span>
      <Switch checked={active} onChange={onToggle} />
    </div>
  );
}

export default function PropertyFilters({
  search,
  onSearchChange,
  onLocationChange,
  onClear,
  ...filterProps
}: PropertyFiltersProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { typeId, status, listingType, availability, locationLabel, propertyTypes,
    onTypeChange, onStatusChange, onListingTypeChange, onAvailabilityChange } = filterProps;

  const activeCount = [typeId, status, listingType, availability, locationLabel].filter(Boolean).length;

  useClickOutside(() => setOpen(false), [wrapperRef]);

  const handleLocationClick = () => {
    setOpen(false);
    openLocationPicker({ onApply: onLocationChange });
  };

  const filterPanel = (
    <>
      <div className="overflow-y-auto flex-1 p-4">
        <div className="divide-y divide-gray-100">
          <div className="pb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Type</p>
            <Select<string>
              value={typeId}
              onChange={(v) => onTypeChange(v ?? "")}
              placeholder="All Types"
              clearable
              wrapperClassName="w-full"
            >
              {propertyTypes.map((t) => (
                <SelectOption key={t.id} value={t.id} label={t.name} />
              ))}
            </Select>
          </div>

          <div className="py-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">Status</p>
            <FilterRow label="Published" active={status === "published"} onToggle={() => onStatusChange(status === "published" ? "" : "published")} />
            <FilterRow label="Draft" active={status === "draft"} onToggle={() => onStatusChange(status === "draft" ? "" : "draft")} />
          </div>

          <div className="py-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">Listing</p>
            <FilterRow label="For Sale" active={listingType === "sale"} onToggle={() => onListingTypeChange(listingType === "sale" ? "" : "sale")} />
            <FilterRow label="For Rent" active={listingType === "rent"} onToggle={() => onListingTypeChange(listingType === "rent" ? "" : "rent")} />
          </div>

          <div className="py-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">Availability</p>
            <FilterRow label="Available" active={availability === "AVAILABLE"} onToggle={() => onAvailabilityChange(availability === "AVAILABLE" ? "" : "AVAILABLE")} />
            <FilterRow label="Sold" active={availability === "SOLD"} onToggle={() => onAvailabilityChange(availability === "SOLD" ? "" : "SOLD")} />
            <FilterRow label="Rented" active={availability === "RENTED"} onToggle={() => onAvailabilityChange(availability === "RENTED" ? "" : "RENTED")} />
          </div>

          <div className="pt-3">
            <button
              onClick={handleLocationClick}
              className={classNames(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                locationLabel
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50",
              )}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{locationLabel || "Filter by location"}</span>
            </button>
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="p-3 border-t border-gray-100">
          <Button
            onClick={() => { onClear(); setOpen(false); }}
            variant="outlined"
            size="sm"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div ref={wrapperRef} className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 flex items-center gap-2 w-full relative">
      <div className="w-56 shrink-0 flex-1">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search properties..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className={classNames(
          "flex items-center gap-2 px-3 h-10 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap",
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
        <ChevronDown className={classNames("w-4 h-4 transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open && (
        <>
          {/* Mobile: full-screen overlay */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="text-base font-semibold text-gray-900">Filters</span>
                {activeCount > 0 && (
                  <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-1.5 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {filterPanel}
          </div>

          {/* Desktop: dropdown */}
          <div className="hidden lg:flex absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-50 flex-col max-h-[480px]">
            {filterPanel}
          </div>
        </>
      )}
    </div>
  );
}
