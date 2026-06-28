"use client";

import { parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function useListingSearchParams(defaultTab = "buy") {
  const [listingType, setListingType] = useQueryState("listingType", parseAsString.withDefault(defaultTab));
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type");
  const [minPrice, setMinPrice] = useQueryState("minPrice");
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice");
  const [bedrooms, setBedrooms] = useQueryState("bedrooms");
  const [pet, setPet] = useQueryState("pet", parseAsBoolean.withDefault(false));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [provinceId, setProvinceId] = useQueryState("provinceId");
  const [districtId, setDistrictId] = useQueryState("districtId");
  const [subDistrictIds, setSubDistrictIds] = useQueryState("subDistrictIds");
  const [stationIds, setStationIds] = useQueryState("stationIds");

  const backSearch = new URLSearchParams();
  if (listingType !== defaultTab) backSearch.set("listingType", listingType);
  if (q) backSearch.set("q", q);
  if (type) backSearch.set("type", type);
  if (minPrice) backSearch.set("minPrice", minPrice);
  if (maxPrice) backSearch.set("maxPrice", maxPrice);
  if (bedrooms) backSearch.set("bedrooms", bedrooms);
  if (pet) backSearch.set("pet", "true");
  if (provinceId) backSearch.set("provinceId", provinceId);
  if (districtId) backSearch.set("districtId", districtId);
  if (subDistrictIds) backSearch.set("subDistrictIds", subDistrictIds);
  if (stationIds) backSearch.set("stationIds", stationIds);
  if (page > 1) backSearch.set("page", String(page));
  const backHref = `/properties${backSearch.toString() ? `?${backSearch.toString()}` : ""}`;

  return {
    listingType, setListingType,
    q, setQ,
    type, setType,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    bedrooms, setBedrooms,
    pet, setPet,
    page, setPage,
    provinceId, setProvinceId,
    districtId, setDistrictId,
    subDistrictIds, setSubDistrictIds,
    stationIds, setStationIds,
    backHref,
  };
}
