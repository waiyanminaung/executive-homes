"use client";

import { SlidersHorizontal } from "lucide-react";
import { Select, SelectOption } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { HomePetToggle } from "@/app/components/home/HomePetToggle";
import { PropertySearchInput, type PropertySearchParams } from "@/components/@shared/PropertySearchInput";
import { PropertyFilterButton } from "@/components/PropertyFilterButton";
import { openFilterModal, type FilterValues } from "@/components/PropertyFilterModal";
import { useListingSearchParams } from "@/utils/useListingSearchParams";

interface ListingSearchBarProps {
  listingType?: "for-sale" | "for-rent";
  propertyType?: string;
}

export function ListingSearchBar({ listingType: listingTypeProp, propertyType }: ListingSearchBarProps) {
  const defaultTab = listingTypeProp === "for-rent" ? "rent" : "buy";
  const {
    listingType, setListingType,
    setQ, type, setType, minPrice, setMinPrice, maxPrice, setMaxPrice,
    bedrooms, setBedrooms, pet, setPet,
    setProvinceId, setDistrictId, setSubDistrictIds, setStationIds, locationLabel, setLocationLabel, setPage,
  } = useListingSearchParams(defaultTab);

  const showListingTypeSelect = !listingTypeProp;
  const showTypeFilter = !propertyType;

  const currentFilterValues: FilterValues = {
    type,
    minPrice: minPrice ?? "",
    maxPrice: maxPrice ?? "",
    bedrooms,
  };

  const activeFilterCount = [
    showTypeFilter && currentFilterValues.type,
    currentFilterValues.minPrice || currentFilterValues.maxPrice,
    currentFilterValues.bedrooms,
  ].filter(Boolean).length;

  const handleFilterApply = (values: FilterValues) => {
    void setType(values.type);
    void setBedrooms(values.bedrooms);
    void setMinPrice(values.minPrice || null);
    void setMaxPrice(values.maxPrice || null);
    void setPage(1);
  };

  const handleOpenFilters = () => {
    openFilterModal({
      initialTab: showTypeFilter ? "type" : "price",
      initialValues: currentFilterValues,
      onApply: handleFilterApply,
      showTypeTab: showTypeFilter,
    });
  };

  const handleApply = (params: PropertySearchParams) => {
    void setQ(params.q ?? null);
    void setProvinceId(params.provinceId ?? null);
    void setDistrictId(params.districtId ?? null);
    void setSubDistrictIds(params.subDistrictIds ?? null);
    void setStationIds(params.stationIds ?? null);
    void setLocationLabel(params.locationLabel ?? null);
    void setPage(1);
  };

  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <PropertySearchInput onApply={handleApply} className="min-w-0 flex-1" initialValue={locationLabel ?? undefined} />

          {showListingTypeSelect && (
            <Select
              value={listingType}
              onChange={(v) => { void setListingType(v ?? "buy"); void setPage(1); }}
              placeholder="Buy / Rent"
              className={classNames(
                "h-[46px] shrink-0 rounded-md border border-gray-300 bg-white px-3 md:px-[14px]",
                "cursor-pointer text-left text-sm font-semibold shadow-sm transition-colors hover:border-gray-400",
              )}
              wrapperClassName="w-[92px] shrink-0 md:w-[110px]"
            >
              <SelectOption value="buy" label="Buy" />
              <SelectOption value="rent" label="Rent" />
            </Select>
          )}

          <button
            type="button"
            onClick={handleOpenFilters}
            aria-label="Open filters"
            className={classNames(
              "relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-md border shadow-sm transition-all hover:shadow-md md:hidden",
              activeFilterCount > 0
                ? "border-primary-500 bg-primary-50 text-primary-700 hover:border-primary-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {showTypeFilter && (
              <PropertyFilterButton tab="type" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />
            )}
            <PropertyFilterButton tab="price" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />
            <PropertyFilterButton tab="bedrooms" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />
          </div>

          <div className="self-center">
            <HomePetToggle value={pet} onChange={(v) => { void setPet(v); void setPage(1); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
