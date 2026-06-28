"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertyItem } from "@/app/types";
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
  const [q] = useQueryState("q", parseAsString.withDefault(""));
  const [tab] = useQueryState("tab", parseAsString.withDefault(defaultTab));
  const [bedrooms] = useQueryState("bedrooms");
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [provinceId] = useQueryState("provinceId");
  const [districtId] = useQueryState("districtId");
  const [subDistrictIds] = useQueryState("subDistrictIds");
  const [stationIds] = useQueryState("stationIds");

  const isForRent = tab === "rent" ? "true" : undefined;
  const isForSale = tab === "buy" ? "true" : undefined;

  const query = {
    page: String(page),
    limit: "12",
    ...(isForRent ? { isForRent } : {}),
    ...(isForSale ? { isForSale } : {}),
    ...(q ? { q } : {}),
    ...(bedrooms ? { beds: bedrooms } : {}),
    ...(propertyType ? { type: propertyType } : {}),
    ...(provinceId ? { provinceId } : {}),
    ...(districtId ? { districtId } : {}),
    ...(subDistrictIds ? { subDistrictIds } : {}),
    ...(stationIds ? { stationIds } : {}),
  };

  const { data, loading } = useRead((api) => api("properties").GET({ query }));

  const properties = (data?.properties ?? []).map(toPropertyItem);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  const title = pageTitle ?? (tab === "rent" ? "Properties for Rent in Bangkok" : "Properties for Sale in Bangkok");

  return (
    <>
      <ListingSearchBar />

      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <ListingResultsBar title={title} count={total} />

          {loading ? (
            <div className="mt-20 flex items-center justify-center">
              <Spinner className="w-8 h-8 text-primary-600" />
            </div>
          ) : properties.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center gap-3 text-center">
              <p className="text-xl font-bold text-neutral-900">No properties found</p>
              <p className="text-sm text-neutral-500">
                Try adjusting your filters to see more results.
              </p>
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
