import type { LucideIcon } from "lucide-react";
import type { PropertyItem } from "@/app/types";
import type { PropertyPricingTier } from "@/types/property";

export interface PropertyDetailStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface PropertyAmenity {
  label: string;
  icon: LucideIcon;
}

export interface PropertyContactItem {
  label: string;
  iconUrl: string;
}

export interface PropertyTransitItem {
  stationId: string;
  code: string | null;
  name: string;
  line: string;
  calculatedMeters: number | null;
  googleMapsUrl: string | null;
}

export interface PropertyDetail extends PropertyItem {
  pricingTiers: PropertyPricingTier[];
  isForSale: boolean;
  isForRent: boolean;
  address: string;
  provinceName: string | null;
  districtName: string | null;
  subDistrictName: string | null;
  description: string;
  isPetFriendly: boolean;
  detailStats: PropertyDetailStat[];
  unitFeatures: PropertyAmenity[];
  commonFacilities: PropertyAmenity[];
  mapImageUrl: string;
  lat: number | null;
  lng: number | null;
  transitStations: PropertyTransitItem[];
}
