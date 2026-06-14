import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { SIMILAR_PROPERTY_CARDS } from "../constants";

export function SimilarProperties() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold leading-[1.5] text-neutral-950">
          Simlar listing for sale in Surat Thani
        </h2>

        <Link
          href="/property-for-sale/surat-thani"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary-500 sm:flex"
        >
          <span>View More</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SIMILAR_PROPERTY_CARDS.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
