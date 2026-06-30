export function PropertyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_12px_rgb(17_24_39/0.08)]">
      <div className="aspect-[305/219] animate-pulse bg-gray-200" />

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:gap-5 md:p-[18px]">
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-2.5">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-3.5 w-10 animate-pulse rounded bg-gray-200" />
            <div className="h-3.5 w-10 animate-pulse rounded bg-gray-200" />
            <div className="h-3.5 w-14 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="h-5 w-2/5 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
