import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PropertyItem } from "@/app/types";
import { formatPrice } from "@/utils/formatPrice";

interface HomeSearchResultsProps {
  properties: PropertyItem[];
}

export function HomeSearchResults({ properties }: HomeSearchResultsProps) {
  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-neutral-950 shadow-detail-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">Search results</p>
          <p className="text-xs text-neutral-500">{properties.length} matching properties</p>
        </div>

        <Link href="/property-for-sale" className="flex items-center gap-1 text-sm font-semibold text-primary-500">
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          {properties.slice(0, 3).map((property) => (
            <Link
              key={property.id}
              href={`/property/${property.id}`}
              className="grid grid-cols-[86px_minmax(0,1fr)] gap-3 rounded-xl border border-gray-200 p-2 transition-colors hover:bg-gray-50"
            >
              <div className="relative h-20 overflow-hidden rounded-lg bg-neutral-200">
                <Image
                  src={property.imageUrls[0]}
                  alt={property.title}
                  fill
                  sizes="86px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <span className="text-xs font-semibold text-primary-500">{property.status}</span>
                <p className="truncate text-sm font-bold text-neutral-950">{property.title}</p>
                <p className="truncate text-xs text-neutral-500">{property.location}</p>
                <p className="mt-1 text-sm font-bold text-secondary-900">
                  {formatPrice(property.price)}{property.status === "Rent" ? "/mo" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-neutral-500">
          No matching mock properties found.
        </div>
      )}
    </div>
  );
}
