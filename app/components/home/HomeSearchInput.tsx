"use client";

import { PropertySearchInput, type PropertySearchParams } from "@/components/@shared/PropertySearchInput";

interface HomeSearchInputProps {
  tab?: "rent" | "buy";
  onSearch: (params: PropertySearchParams) => void;
}

export function HomeSearchInput({ onSearch }: HomeSearchInputProps) {
  return (
    <PropertySearchInput
      showSearchButton
      onApply={onSearch}
      inputClassName="h-12 text-base font-medium text-neutral-900 md:h-[46px] md:text-sm"
    />
  );
}
