"use client";

import { Select, SelectOption } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { HomePetToggle } from "@/app/components/home/HomePetToggle";
import { PropertySearchInput, type PropertySearchParams } from "@/components/@shared/PropertySearchInput";
import { PropertyFilterButton } from "@/components/PropertyFilterButton";
import { type FilterValues } from "@/components/PropertyFilterModal";
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

  const handleFilterApply = (values: FilterValues) => {
    void setType(values.type);
    void setBedrooms(values.bedrooms);
    void setMinPrice(values.minPrice || null);
    void setMaxPrice(values.maxPrice || null);
    void setPage(1);
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
                "h-[46px] shrink-0 rounded-md border border-gray-300 bg-white px-[14px]",
                "cursor-pointer text-left text-sm font-semibold shadow-sm transition-colors hover:border-gray-400",
              )}
              wrapperClassName="w-[110px] shrink-0"
            >
              <SelectOption value="buy" label="Buy" />
              <SelectOption value="rent" label="Rent" />
            </Select>
          )}

          {showTypeFilter && (
            <PropertyFilterButton tab="type" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />
          )}
          <PropertyFilterButton tab="price" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />
          <PropertyFilterButton tab="bedrooms" values={currentFilterValues} onApply={handleFilterApply} showTypeTab={showTypeFilter} />

          <div className="self-center">
            <HomePetToggle value={pet} onChange={(v) => { void setPet(v); void setPage(1); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
