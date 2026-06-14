const PROPERTY_TYPE_LABELS: Record<string, string> = {
  property: "Properties",
  condo: "Condos",
  apartment: "Apartments",
  house: "Houses",
  "office-space": "Office Spaces",
  "commercial-space": "Commercial Spaces",
  penthouse: "Penthouses",
  villa: "Villas",
  townhouse: "Townhouses",
  warehouse: "Warehouses",
  "retail-space": "Retail Spaces",
};

export interface ParsedListing {
  listingType: "for-sale" | "for-rent";
  propertyType: string | undefined;
  propertyTypeLabel: string;
}

export function parseListingParam(listing: string): ParsedListing | null {
  const forSale = listing.endsWith("-for-sale");
  const forRent = listing.endsWith("-for-rent");

  if (!forSale && !forRent) return null;

  const listingType = forSale ? "for-sale" : "for-rent";
  const propertyType = listing.replace(/-for-(sale|rent)$/, "");

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[propertyType];

  if (!propertyTypeLabel) return null;

  return {
    listingType,
    propertyType: propertyType === "property" ? undefined : propertyType,
    propertyTypeLabel,
  };
}
