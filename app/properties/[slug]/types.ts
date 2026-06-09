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

export interface PropertyDetail extends PropertyItem {
  salePrice: number;
  rentPrice: number;
  address: string;
  description: string;
  detailStats: PropertyDetailStat[];
  unitFeatures: PropertyAmenity[];
  commonFacilities: PropertyAmenity[];
  mapImageUrl: string;
}
