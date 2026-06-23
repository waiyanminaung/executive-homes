import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { PropertyDetail, PropertyTransitItem } from "../types";
import { PropertyShareButton } from "./PropertyShareButton";
import { formatPrice } from "@/utils/formatPrice";
import { TRANSIT_LINE_COLORS } from "@/constants/transitStations";
import { WALKING_SPEED_METERS_PER_MIN } from "@/app/constants";
import { classNames } from "@/utils/classNames";
import type { TransitLine } from "@/constants/transitStations";
import type { PropertyPricingTier } from "@/types/property";

interface SinglePriceDisplayProps {
  tier: PropertyPricingTier;
  isForSale: boolean;
  isForRent: boolean;
}

function SinglePriceDisplay({ tier, isForSale, isForRent }: SinglePriceDisplayProps) {
  return (
    <div className="grid gap-2">
      {isForSale && tier.salePrice != null && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-neutral-600">For sale</span>
          <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
            {formatPrice(tier.salePrice)}
          </span>
        </div>
      )}

      {isForRent && tier.rentPrice != null && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-neutral-600">For rent</span>
          <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
            {formatPrice(tier.rentPrice)}/mo
          </span>
        </div>
      )}
    </div>
  );
}

interface PricingTiersTableProps {
  tiers: PropertyPricingTier[];
  isForSale: boolean;
  isForRent: boolean;
}

function PricingTiersTable({ tiers, isForSale, isForRent }: PricingTiersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Furnishing</th>
            {isForRent && <th className="py-2 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Rent / mo</th>}
            {isForSale && <th className="py-2 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Sale</th>}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.id} className="border-b border-gray-100 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-neutral-900">{tier.label || "—"}</td>
              {isForRent && (
                <td className="py-2.5 pr-4 font-bold text-secondary-500">
                  {tier.rentPrice != null ? `${formatPrice(tier.rentPrice)}` : "—"}
                </td>
              )}
              {isForSale && (
                <td className="py-2.5 font-bold text-secondary-500">
                  {tier.salePrice != null ? formatPrice(tier.salePrice) : "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
      {station.googleMapsUrl ? (
        <Link
          href={station.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-sm text-neutral-700 hover:text-primary-600 hover:underline transition-colors"
        >
          {distanceText}
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-primary-500 transition-colors" />
        </Link>
      ) : (
        <span className="text-sm text-neutral-700">{distanceText}</span>
      )}
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

          <div className="flex items-center gap-2">
            <LocationIcon className="h-5 w-5 shrink-0 text-neutral-600" />
            <p className="text-sm font-semibold text-neutral-600">
              {[property.address, property.subDistrictName, property.districtName, property.provinceName]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div className="mt-4">
            {property.pricingTiers.length === 1 ? (
              <SinglePriceDisplay tier={property.pricingTiers[0]} isForSale={property.isForSale} isForRent={property.isForRent} />
            ) : property.pricingTiers.length > 1 ? (
              <PricingTiersTable tiers={property.pricingTiers} isForSale={property.isForSale} isForRent={property.isForRent} />
            ) : null}
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
