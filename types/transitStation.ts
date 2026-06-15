export interface TransitStation {
  id: string;
  code: string | null;
  name: string;
  slug: string;
  line: string;
}

export interface PropertyTransitItem {
  id: string;
  stationId: string;
  distanceMeters: number;
  station: TransitStation;
}
