"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { PropertyListItem } from "@/types/property";
import PropertyStatusBadge from "./PropertyStatusBadge";

const formatPrice = (price: number | null) => {
  if (!price) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(price);
};

interface Props {
  property: PropertyListItem;
  onDelete: (id: string, title: string) => void;
}

export default function PropertyCard({ property, onDelete }: Props) {
  const minSale = property.pricingTiers.map((t) => t.salePrice).filter((v): v is number => v !== null);
  const minRent = property.pricingTiers.map((t) => t.rentPrice).filter((v): v is number => v !== null);
  const salePrice = minSale.length > 0 ? formatPrice(Math.min(...minSale)) : null;
  const rentPrice = minRent.length > 0 ? formatPrice(Math.min(...minRent)) : null;

  let priceDisplay = "—";
  if (salePrice && rentPrice) priceDisplay = `${salePrice} / ${rentPrice}/mo`;
  else if (salePrice) priceDisplay = salePrice;
  else if (rentPrice) priceDisplay = `${rentPrice}/mo`;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/properties/${property.id}/edit`}
            className="text-sm font-semibold text-gray-900 hover:text-primary-700 transition-colors line-clamp-2 leading-snug"
          >
            {property.title}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{property.propertyType.name}</p>
        </div>

        <span className={classNames(
          "shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md",
          property.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500",
        )}>
          {property.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <PropertyStatusBadge
          isForSale={property.isForSale}
          isForRent={property.isForRent}
          availabilityStatus={property.availabilityStatus}
        />
        <span className="ml-auto text-sm font-medium text-gray-800">{priceDisplay}</span>
      </div>

      <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
        <Link
          href={`/admin/properties/${property.id}/edit`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(property.id, property.title)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
