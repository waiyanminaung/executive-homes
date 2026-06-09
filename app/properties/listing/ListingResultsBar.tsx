"use client";

import { Select, SelectOption } from "@geckoui/geckoui";
import { parseAsString, useQueryState } from "nuqs";

interface ListingResultsBarProps {
  title: string;
  count: number;
}

export function ListingResultsBar({ title, count }: ListingResultsBarProps) {
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("default"));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-lg font-bold text-neutral-950">{title}</h1>
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <span className="text-base font-semibold text-neutral-500">
          {count.toLocaleString()} listed
        </span>
      </div>

      <Select
        value={sort}
        onChange={(v) => void setSort(v ?? "default")}
        className="h-[42px] rounded-md border border-border bg-white px-4 text-sm font-semibold text-neutral-600 shadow-none"
        wrapperClassName="sm:w-auto w-full"
      >
        <SelectOption value="default" label="Sort: Default" />
        <SelectOption value="price-asc" label="Price: Low to High" />
        <SelectOption value="price-desc" label="Price: High to Low" />
        <SelectOption value="newest" label="Newest First" />
      </Select>
    </div>
  );
}
