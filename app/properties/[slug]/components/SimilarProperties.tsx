import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyItem } from "@/app/types";

interface SimilarPropertiesProps {
  properties: PropertyItem[];
  viewMoreHref?: string;
  hasMore?: boolean;
}

export function SimilarProperties({ properties, viewMoreHref = "/properties", hasMore = false }: SimilarPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold leading-[1.5] text-neutral-950">
          Similar listings
        </h2>

        {hasMore && (
          <Link
            href={viewMoreHref}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary-500 sm:flex"
          >
            <span>View More</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
