"use client";

import { MapPin } from "lucide-react";
import { Select, SelectOption } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { PropertyTypeItem } from "@/types/propertyType";

export interface FilterSelectsProps {
  typeId: string;
  status: string;
  listingType: string;
  availability: string;
  locationLabel: string;
  propertyTypes: PropertyTypeItem[];
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onListingTypeChange: (v: string) => void;
  onAvailabilityChange: (v: string) => void;
  vertical?: boolean;
}

interface Props extends FilterSelectsProps {
  onLocationClick: () => void;
}

interface PillGroupProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  vertical?: boolean;
}

function PillGroup({ label, options, value, onChange, vertical }: PillGroupProps) {
  return (
    <div className={classNames(vertical ? "flex flex-col gap-1.5" : "flex items-center")}>
      {label && vertical && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      )}
      <div className="flex items-center h-10 rounded-lg border border-gray-200 overflow-hidden">
        {options.map((opt, i) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(active ? "" : opt.value)}
              className={classNames(
                "h-full px-3 text-xs font-semibold transition-colors whitespace-nowrap",
                vertical ? "flex-1" : "",
                i > 0 ? "border-l border-gray-200" : "",
                active ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterSelects({
  typeId,
  status,
  listingType,
  availability,
  locationLabel,
  propertyTypes,
  onTypeChange,
  onStatusChange,
  onListingTypeChange,
  onAvailabilityChange,
  onLocationClick,
  vertical = false,
}: Props) {
  return (
    <div className={classNames(vertical ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-2")}>
      <Select<string>
        value={typeId}
        onChange={(v) => onTypeChange(v ?? "")}
        placeholder="All Types"
        clearable
        wrapperClassName={vertical ? "w-full" : "w-36"}
      >
        {propertyTypes.map((t) => (
          <SelectOption key={t.id} value={t.id} label={t.name} />
        ))}
      </Select>

      {!vertical && <div className="h-5 w-px bg-gray-200 shrink-0" />}

      <PillGroup
        label="Status"
        options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]}
        value={status}
        onChange={onStatusChange}
        vertical={vertical}
      />

      <PillGroup
        label="Listing"
        options={[{ value: "sale", label: "For Sale" }, { value: "rent", label: "For Rent" }]}
        value={listingType}
        onChange={onListingTypeChange}
        vertical={vertical}
      />

      <PillGroup
        label="Availability"
        options={[
          { value: "AVAILABLE", label: "Available" },
          { value: "SOLD", label: "Sold" },
          { value: "RENTED", label: "Rented" },
        ]}
        value={availability}
        onChange={onAvailabilityChange}
        vertical={vertical}
      />

      {!vertical && <div className="h-5 w-px bg-gray-200 shrink-0" />}

      <button
        onClick={onLocationClick}
        className={classNames(
          "flex items-center gap-1.5 px-3 h-10 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap",
          vertical ? "w-full justify-start py-2 text-sm" : "",
          locationLabel
            ? "border-primary-300 bg-primary-50 text-primary-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{locationLabel || "Location"}</span>
      </button>
    </div>
  );
}
