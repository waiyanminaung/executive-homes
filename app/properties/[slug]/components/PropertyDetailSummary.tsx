import type { PropertyDetail, PropertyTransitItem } from "../types";
import { PropertyShareButton } from "./PropertyShareButton";
import { formatPrice } from "@/utils/formatPrice";
import { TRANSIT_LINE_COLORS } from "@/constants/transitStations";
import { WALKING_SPEED_METERS_PER_MIN } from "@/app/constants";
import { classNames } from "@/utils/classNames";
import type { TransitLine } from "@/constants/transitStations";

const AVAILABILITY_BADGE: Record<string, string> = {
  SOLD: "bg-gray-100 text-gray-700",
  RENTED: "bg-amber-50 text-amber-700",
};

function TransitRow({ station }: { station: PropertyTransitItem }) {
  const color = TRANSIT_LINE_COLORS[station.line as TransitLine];
  const stationLabel = station.code ? `${station.code} ${station.name}` : station.name;

  const distanceText =
    station.calculatedMeters !== null
      ? `${station.calculatedMeters} m (${Math.round(station.calculatedMeters / WALKING_SPEED_METERS_PER_MIN)} mins) from ${stationLabel}`
      : `Near ${stationLabel}`;

  return (
    <div className="flex items-center gap-2.5">
      <span className="h-3.5 w-3.5 shrink-0 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-sm text-neutral-700">{distanceText}</span>
    </div>
  );
}

interface PropertyDetailSummaryProps {
  property: PropertyDetail;
}

export function PropertyDetailSummary({ property }: PropertyDetailSummaryProps) {
  const LocationIcon = property.detailStats[0].icon;
  const availabilityBadgeClass = AVAILABILITY_BADGE[property.availabilityStatus];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-detail-card md:p-[30px]">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_45px] md:items-start">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold leading-snug text-neutral-900">
              {property.title}
            </h1>

            {property.availabilityStatus !== "AVAILABLE" && (
              <span
                className={classNames(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                  availabilityBadgeClass,
                )}
              >
                {property.availabilityStatus}
              </span>
            )}
          </div>

          <p className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <LocationIcon className="h-5 w-5 shrink-0" />
            <span>{property.address}</span>
          </p>

          <div className="mt-4 grid gap-2">
            {property.isForSale && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-neutral-600">For sale</span>
                <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
                  {formatPrice(property.salePrice)}
                </span>
              </div>
            )}

            {property.isForRent && (
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

      {property.transitStations.length > 0 && (
        <div className="mt-5 space-y-2.5">
          {property.transitStations.map((station) => (
            <TransitRow key={station.stationId} station={station} />
          ))}
        </div>
      )}
    </section>
  );
}
