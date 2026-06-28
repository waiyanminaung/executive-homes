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
  type: "station" | "property";
  stationId?: string;
  slug?: string;
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

  const { data: propertiesData, loading } = useRead(
    (api) => api("properties").GET({ query: { q: debouncedQuery, limit: "5" } }),
    { enabled: active },
  );

  if (!trimmed) return { results: [], loading: false };

  const q = trimmed.toLowerCase();

  const stationResults: SearchResult[] = (stationsData?.stations ?? [])
    .filter((s) => s.name.toLowerCase().includes(q) || (s.code?.toLowerCase().includes(q) ?? false))
    .slice(0, 4)
    .map((s) => ({
      id: s.id,
      name: s.name,
      description: TRANSIT_LINE_LABELS[s.line as TransitLine] ?? s.line,
      badge: stationBadge(s.line),
      type: "station" as const,
      stationId: s.id,
    }));

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

  return { results: [...stationResults, ...propertyResults], loading: active && loading };
}
