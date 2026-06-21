export interface Province {
  id: string;
  name: string;
  slug: string;
  propertyCount: number;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  provinceId: string;
  propertyCount: number;
}

export interface SubDistrict {
  id: string;
  name: string;
  slug: string;
  districtId: string;
  propertyCount: number;
}
