"use client";

interface ListingResultsBarProps {
  title: string;
  count: number;
}

export function ListingResultsBar({ title, count }: ListingResultsBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-lg font-bold text-neutral-950">{title}</h1>
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        <span className="text-base font-semibold text-neutral-500">
          {count.toLocaleString()} listed
        </span>
      </div>
    </div>
  );
}
