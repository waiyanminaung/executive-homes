interface PropertiesFilter {
  listingType?: "rent" | "buy";
  type?: string;
  provinceId?: string;
  districtId?: string;
}

export function buildPropertiesHref(filters: PropertiesFilter = {}): string {
  const params = new URLSearchParams();
  if (filters.listingType) params.set("listingType", filters.listingType);
  if (filters.type) params.set("type", filters.type);
  if (filters.provinceId) params.set("provinceId", filters.provinceId);
  if (filters.districtId) params.set("districtId", filters.districtId);
  return `/properties${params.toString() ? `?${params.toString()}` : ""}`;
}
