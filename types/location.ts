export interface Province {
  id: string;
  name: string;
  slug: string;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  provinceId: string;
}
