import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

interface PropertyCarouselSkeletonProps {
  title?: string;
}

export function PropertyCarouselSkeleton({ title }: PropertyCarouselSkeletonProps) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between gap-4 md:mb-7">
        {title ? (
          <h2 className="text-2xl font-bold text-neutral-950 md:text-[28px]">{title}</h2>
        ) : (
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        )}
      </div>

      <div className="-mx-3 -mb-4 -mt-2">
        <div className="overflow-hidden px-3 pb-4 pt-2">
          <div className="-ml-4 flex md:-ml-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-0 flex-[0_0_88%] self-stretch pl-4 sm:flex-[0_0_48%] md:flex-[0_0_33.333%] md:pl-5 lg:flex-[0_0_25%]"
              >
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
