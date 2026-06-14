export interface PropertyListItem {
  id: string;
  slug: string;
  title: string;
  propertyType: string;
  status: string;
  salePrice: number | null;
  rentPrice: number | null;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  isFeatured: boolean;
  isPublished: boolean;
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
  propertyType: string;
  status: string;
  salePrice: number | null;
  rentPrice: number | null;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  address: string;
  provinceId: string;
  districtId: string | null;
  subDistrictId: string | null;
  mapImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
}

export interface Province {
  id: string;
  name: string;
  slug: string;
}
