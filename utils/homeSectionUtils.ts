import type { PropertyItem } from "@/app/types";

export function toListingType(isForRent: boolean, isForSale: boolean): PropertyItem["listingType"] {
  if (isForRent && isForSale) return "Sale & Rent";
  if (isForRent) return "Rent";
  return "Sale";
}

export function toPrice(
  listingType: "RENT" | "SALE" | "BOTH",
  rentPrice: number | null,
  salePrice: number | null,
): number {
  if (listingType === "RENT") return rentPrice ?? 0;
  if (listingType === "SALE") return salePrice ?? 0;
  return rentPrice ?? salePrice ?? 0;
}
