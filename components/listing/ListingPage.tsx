"use client";

import { Building2 } from "lucide-react";
import { useRead } from "@/lib/spoosh";
import { PropertyGridSkeleton } from "@/components/skeletons/PropertyGridSkeleton";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyItem } from "@/app/types";
import { useListingSearchParams } from "@/utils/useListingSearchParams";
import { ListingSearchBar } from "./ListingSearchBar";
import { ListingResultsBar } from "./ListingResultsBar";
import { ListingPagination } from "./ListingPagination";
import { getMinSalePrice, getMinRentPrice } from "@/utils/getMinPrice";


interface PropertyApiItem {
  id: string;
  slug: string;
  title: string;
  address: string;
  pricingTiers: { salePrice: number | null; rentPrice: number | null; order: number }[];
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  images: { url: string }[];
}

function toPropertyItem(p: PropertyApiItem): PropertyItem {
  const listingType = p.isForSale && p.isForRent ? "Sale & Rent" : p.isForSale ? "Sale" : "Rent";

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    location: p.address,
    minSalePrice: getMinSalePrice(p.pricingTiers, p.isForSale),
    minRentPrice: getMinRentPrice(p.pricingTiers, p.isForRent),
    hasMultipleTiers: p.pricingTiers.length > 1,
    imageUrls: p.images.map((img) => img.url),
    listingType,
    availabilityStatus: p.availabilityStatus as "AVAILABLE" | "SOLD" | "RENTED",
    beds: p.beds ?? 0,
    baths: p.baths ?? 0,
    area: `${p.areaSqm.toFixed(2)} sqm`,
  };
}

interface ListingPageProps {
  listingType?: "for-sale" | "for-rent";
  propertyType?: string;
  defaultLocation?: string;
  pageTitle?: string;
}

export function ListingPage({ listingType, propertyType, pageTitle }: ListingPageProps) {
  const defaultTab = listingType === "for-rent" ? "rent" : "buy";
  const { listingType: tab, q, type, bedrooms, minPrice, maxPrice, page, pet, provinceId, districtId, subDistrictIds, stationIds, locationLabel, backHref } = useListingSearchParams(defaultTab);

  const isForRent = tab === "rent" ? "true" : undefined;
  const isForSale = tab === "buy" ? "true" : undefined;

  const query = {
    page: String(page),
    limit: "12",
    ...(isForRent ? { isForRent } : {}),
    ...(isForSale ? { isForSale } : {}),
    ...(q ? { q } : {}),
    ...(bedrooms ? { beds: bedrooms } : {}),
    ...(type ? { type } : {}),
    ...(propertyType ? { type: propertyType } : {}),
    ...(minPrice ? { minPrice } : {}),
    ...(maxPrice ? { maxPrice } : {}),
    ...(pet ? { isPetFriendly: "true" } : {}),
    ...(provinceId ? { provinceId } : {}),
    ...(districtId ? { districtId } : {}),
    ...(subDistrictIds ? { subDistrictIds } : {}),
    ...(stationIds ? { stationIds } : {}),
  };

  const { data, loading } = useRead((api) => api("properties").GET({ query }));

  const properties = (data?.properties ?? []).map(toPropertyItem);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  const baseTitle = tab === "rent" ? "Properties for Rent" : "Properties for Sale";
  const title = pageTitle ?? (locationLabel ? `${baseTitle} in ${locationLabel}` : baseTitle);

  return (
    <>
      <ListingSearchBar listingType={listingType} />

      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <ListingResultsBar title={title} count={total} />

          {loading ? (
            <PropertyGridSkeleton count={12} />
          ) : properties.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} backHref={backHref} />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                <Building2 className="h-9 w-9 text-neutral-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xl font-bold text-neutral-900">No properties found</p>
                <p className="max-w-xs text-sm text-neutral-500">
                  Try adjusting your filters or search in a different area to see more results.
                </p>
              </div>
            </div>
          )}

          <div className="mt-10">
            <ListingPagination totalPages={totalPages} />
          </div>
        </div>
      </main>
    </>
  );
}
