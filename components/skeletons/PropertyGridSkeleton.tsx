import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

interface PropertyGridSkeletonProps {
  count?: number;
}

export function PropertyGridSkeleton({ count = 12 }: PropertyGridSkeletonProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
