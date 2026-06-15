export interface TransitStation {
  id: string;
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
