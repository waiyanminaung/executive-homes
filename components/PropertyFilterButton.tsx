"use client";

import { X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { openFilterModal, type FilterValues } from "@/components/PropertyFilterModal";

interface PropertyFilterButtonProps {
  tab: "type" | "price" | "bedrooms";
  values: FilterValues;
  onApply: (values: FilterValues) => void;
  className?: string;
}

function formatPrice(value: string): string {
  const n = Number(value);
  if (n >= 1_000_000) return `฿${parseFloat((n / 1_000_000).toFixed(1))}M`;
  if (n >= 1_000) return `฿${parseFloat((n / 1_000).toFixed(1))}K`;
  return `฿${n}`;
}

function getLabel(tab: "type" | "price" | "bedrooms", values: FilterValues): string {
  if (tab === "type") {
    return values.type
      ? (HOME_HERO_FILTER_OPTIONS.types.find((o) => o.value === values.type)?.label ?? "Type")
      : "Type";
  }

  if (tab === "price") {
    if (!values.minPrice && !values.maxPrice) return "Price";
    if (values.minPrice && values.maxPrice) return `${formatPrice(values.minPrice)} – ${formatPrice(values.maxPrice)}`;
    if (values.minPrice) return `${formatPrice(values.minPrice)}+`;
    return `Up to ${formatPrice(values.maxPrice)}`;
  }

  return values.bedrooms
    ? (HOME_HERO_FILTER_OPTIONS.bedrooms.find((o) => o.value === values.bedrooms)?.label ?? "Bedrooms")
    : "Bedrooms";
}

function clearValues(tab: "type" | "price" | "bedrooms", values: FilterValues): FilterValues {
  if (tab === "type") return { ...values, type: null };
  if (tab === "price") return { ...values, minPrice: "", maxPrice: "" };
  return { ...values, bedrooms: null };
}

function isActive(tab: "type" | "price" | "bedrooms", values: FilterValues): boolean {
  if (tab === "type") return !!values.type;
  if (tab === "price") return !!(values.minPrice || values.maxPrice);
  return !!values.bedrooms;
}

export function PropertyFilterButton({ tab, values, onApply, className }: PropertyFilterButtonProps) {
  const label = getLabel(tab, values);
  const active = isActive(tab, values);

  const handleClick = () => {
    openFilterModal({ initialTab: tab, initialValues: values, onApply });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(clearValues(tab, values));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames(
        "flex h-[46px] min-w-0 items-center justify-between gap-1.5 rounded-md border bg-white px-[14px]",
        "cursor-pointer text-left text-sm font-semibold shadow-sm transition-colors hover:border-gray-400",
        active ? "border-primary-400 text-neutral-900" : "border-gray-300 text-neutral-400",
        className,
      )}
    >
      <span className="truncate">{label}</span>

      {active && (
        <span
          role="button"
          onClick={handleClear}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
