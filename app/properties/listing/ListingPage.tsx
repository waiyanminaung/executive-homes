"use client";

import { parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { MOCK_PROPERTIES } from "@/app/constants";
import { PropertyCard } from "@/components/PropertyCard";
import { ListingSearchBar } from "./ListingSearchBar";
import { ListingResultsBar } from "./ListingResultsBar";
import { ListingPagination } from "./ListingPagination";

const PAGE_SIZE = 12;

export function ListingPage() {
  const [q] = useQueryState("q", parseAsString.withDefault(""));
  const [tab] = useQueryState("tab", parseAsString.withDefault("buy"));
  const [location] = useQueryState("location");
  const [bedrooms] = useQueryState("bedrooms");
  const [sort] = useQueryState("sort", parseAsString.withDefault("default"));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  useQueryState("pet", parseAsBoolean.withDefault(false));

  const filtered = MOCK_PROPERTIES.filter((p) => {
    const keyword = q.trim().toLowerCase();
    const matchesTab = tab === "rent" ? p.status === "Rent" : p.status === "Sale";
    const matchesKeyword =
      !keyword || `${p.title} ${p.location}`.toLowerCase().includes(keyword);
    const matchesLocation = !location || p.location.toLowerCase().includes(location);
    const matchesBedrooms =
      !bedrooms || bedrooms === "5+" ? !bedrooms || p.beds >= 5 : p.beds === Number(bedrooms);
    return matchesTab && matchesKeyword && matchesLocation && matchesBedrooms;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const title =
    tab === "rent" ? "Apartments for Rent in Bangkok" : "Properties for Sale in Bangkok";

  return (
    <>
      <ListingSearchBar />

      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-[1292px] px-4 py-8 md:px-6 xl:px-0">
          <ListingResultsBar title={title} count={sorted.length} />

          {paginated.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {paginated.map((property) => (
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
