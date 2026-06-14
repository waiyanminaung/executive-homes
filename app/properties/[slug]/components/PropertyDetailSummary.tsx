import type { PropertyDetail } from "../types";
import { PropertyShareButton } from "./PropertyShareButton";
import { formatPrice } from "@/utils/formatPrice";

interface PropertyDetailSummaryProps {
  property: PropertyDetail;
  listingType?: "sale" | "rent";
}

export function PropertyDetailSummary({ property, listingType }: PropertyDetailSummaryProps) {
  const LocationIcon = property.detailStats[0].icon;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-detail-card md:p-[30px]">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_45px] md:items-start">
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold leading-snug text-neutral-900">
            {property.title}
          </h1>

          <p className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <LocationIcon className="h-5 w-5 shrink-0" />
            <span>{property.address}</span>
          </p>

          <div className="mt-4 grid gap-2">
            {listingType !== "rent" && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-600">For sale</span>
                <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
                  {formatPrice(property.salePrice)}
                </span>
              </div>
            )}

            {listingType !== "sale" && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-600">For rent</span>
                <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
                  {formatPrice(property.rentPrice)}/mo
                </span>
              </div>
            )}
          </div>
        </div>

        <PropertyShareButton title={property.title} />
      </div>

      <dl className="mt-5 grid overflow-hidden rounded-[10px] border border-gray-300 bg-gray-400 sm:grid-cols-2 lg:grid-cols-3">
        {property.detailStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-[18px] border-gray-300 bg-white px-[18px] py-3.5 sm:border-r sm:border-b">
            <stat.icon className="h-6 w-6 shrink-0 text-neutral-950" />
            <div className="grid gap-1">
              <dt className="text-sm font-semibold leading-[18px] text-neutral-500">
                {stat.label}
              </dt>
              <dd className="text-sm font-bold leading-[18px] text-neutral-900">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

    </section>
  );
}
