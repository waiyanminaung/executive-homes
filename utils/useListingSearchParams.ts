"use client";

import { parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";

export function useListingSearchParams(defaultTab = "buy") {
  const [listingType, setListingType] = useQueryState("listingType", parseAsString.withDefault(defaultTab));
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type");
  const [location, setLocation] = useQueryState("location");
  const [price, setPrice] = useQueryState("price");
  const [bedrooms, setBedrooms] = useQueryState("bedrooms");
  const [pet, setPet] = useQueryState("pet", parseAsBoolean.withDefault(false));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [provinceId] = useQueryState("provinceId");
  const [districtId] = useQueryState("districtId");
  const [subDistrictIds] = useQueryState("subDistrictIds");
  const [stationIds] = useQueryState("stationIds");

  const backSearch = new URLSearchParams();
  if (listingType !== defaultTab) backSearch.set("listingType", listingType);
  if (q) backSearch.set("q", q);
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
    location, setLocation,
    price, setPrice,
    bedrooms, setBedrooms,
    pet, setPet,
    page, setPage,
    provinceId,
    districtId,
    subDistrictIds,
    stationIds,
    backHref,
  };
}
