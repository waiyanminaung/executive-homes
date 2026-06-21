import type { PropertyItem } from "@/app/types";

export interface HomeSection {
  id: string;
  title: string;
  propertyTypeId: string | null;
  propertyType: { id: string; name: string; slug: string } | null;
  listingType: "RENT" | "SALE" | "BOTH";
  onlyFeatured: boolean;
  provinceId: string | null;
  province: { id: string; name: string; slug: string } | null;
  districtId: string | null;
  district: { id: string; name: string; slug: string } | null;
  limit: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomeSectionWithProperties extends HomeSection {
  properties: PropertyItem[];
}
