import type { Feature } from "./feature";
import type { PropertyTransitItem } from "./transitStation";
import type { PropertyTypeItem } from "./propertyType";

export interface PropertyListItem {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyTypeItem;
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  salePrice: number | null;
  rentPrice: number | null;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  isFeatured: boolean;
  isPublished: boolean;
  isPetFriendly: boolean;
  createdAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  order: number;
}

export interface PropertyDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyTypeItem;
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  salePrice: number | null;
  rentPrice: number | null;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  address: string;
  provinceId: string;
  districtId: string | null;
  subDistrictId: string | null;
  lat: number | null;
  lng: number | null;
  mapImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  isPetFriendly: boolean;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  features: Feature[];
  transitStations: PropertyTransitItem[];
}

export interface Province {
  id: string;
  name: string;
  slug: string;
}
