import type { LucideIcon } from "lucide-react";
import type { PropertyItem } from "@/app/types";

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
}

export interface PropertyDetail extends PropertyItem {
  salePrice: number;
  rentPrice: number;
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
  transitStations: PropertyTransitItem[];
}
