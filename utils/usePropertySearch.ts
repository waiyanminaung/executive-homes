"use client";

import { useRead } from "@/lib/spoosh";
import { useDebounce } from "./useDebounce";
import { TRANSIT_LINE_LABELS } from "@/constants/transitStations";
import type { TransitLine } from "@/constants/transitStations";

export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  badge: string;
  type: "station" | "property" | "province" | "district" | "subdistrict";
  stationId?: string;
  slug?: string;
  provinceId?: string;
  districtId?: string;
  subDistrictId?: string;
}

function stationBadge(line: string): string {
  if (line.startsWith("BTS")) return "BTS Station";
  if (line.startsWith("MRT")) return "MRT Station";
  if (line === "ARL") return "Airport Rail Link";
  if (line === "SRT_RED") return "SRT";
  if (line === "BRT") return "BRT";
  return "Station";
}

export function usePropertySearch(query: string) {
  const trimmed = query.trim();
  const debouncedQuery = useDebounce(trimmed, 300);
  const active = debouncedQuery.length >= 2;

  const { data: stationsData } = useRead((api) => api("transit-stations").GET({}), {
    staleTime: 5 * 60 * 1000,
  });

  const { data: propertiesData, loading: propLoading } = useRead(
    (api) => api("properties").GET({ query: { q: debouncedQuery, limit: "5" } }),
    { enabled: active },
  );

  const { data: locationsData, loading: locLoading } = useRead(
    (api) => api("locations/search").GET({ query: { q: debouncedQuery } }),
    { enabled: active },
  );

  if (!trimmed) return { results: [], loading: false };

  const q = trimmed.toLowerCase();

  const stationResults: SearchResult[] = (stationsData?.stations ?? [])
    .filter((s) => s.name.toLowerCase().includes(q) || (s.code?.toLowerCase().includes(q) ?? false))
    .slice(0, 3)
    .map((s) => ({
      id: s.id,
      name: s.name,
      description: TRANSIT_LINE_LABELS[s.line as TransitLine] ?? s.line,
      badge: stationBadge(s.line),
      type: "station" as const,
      stationId: s.id,
    }));

  const locationResults: SearchResult[] = active
    ? (locationsData?.results ?? []).map((loc) => {
        if (loc.type === "province") {
          return { id: loc.id, name: loc.name, badge: "Province", type: "province" as const, provinceId: loc.provinceId };
        }
        if (loc.type === "district") {
          return { id: loc.id, name: loc.name, description: loc.provinceName, badge: "District", type: "district" as const, provinceId: loc.provinceId, districtId: loc.districtId };
        }
        return { id: loc.id, name: loc.name, description: `${loc.districtName}, ${loc.provinceName}`, badge: "Sub-district", type: "subdistrict" as const, provinceId: loc.provinceId, districtId: loc.districtId, subDistrictId: loc.subDistrictId };
      })
    : [];

  const propertyResults: SearchResult[] = active
    ? (propertiesData?.properties ?? []).map((p) => ({
        id: p.id,
        name: p.title,
        description: p.address,
        badge: p.propertyType.name,
        type: "property" as const,
        slug: p.slug,
      }))
    : [];

  return {
    results: [...locationResults, ...stationResults, ...propertyResults],
    loading: active && (propLoading || locLoading),
  };
}
