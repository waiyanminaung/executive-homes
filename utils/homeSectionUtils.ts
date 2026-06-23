import type { PropertyItem } from "@/app/types";

export function toListingType(isForRent: boolean, isForSale: boolean): PropertyItem["listingType"] {
  if (isForRent && isForSale) return "Sale & Rent";
  if (isForRent) return "Rent";
  return "Sale";
}

