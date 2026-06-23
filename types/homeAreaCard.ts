export interface HomeAreaCard {
  id: string;
  name: string;
  imageKey: string;
  imageUrl: string;
  order: number;
  listingCount: number;
  provinceId: string | null;
  province: { id: string; name: string; slug: string } | null;
  districtId: string | null;
  district: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientHomeAreaCard extends HomeAreaCard {
  listings: number;
  imageUrl: string;
}
