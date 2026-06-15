"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Train } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { TRANSIT_LINE_LABELS, TRANSIT_LINE_COLORS, TRANSIT_LINES, type TransitLine } from "@/constants/transitStations";
import AdminPageHeader from "../components/AdminPageHeader";
import type { TransitStation } from "@/types/transitStation";

export default function AdminTransitStationsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, loading } = useRead((api) => api("admin/transit-stations").GET());

  const stations = data?.stations ?? [];

  const grouped = TRANSIT_LINES.reduce<Record<TransitLine, TransitStation[]>>((acc, line) => {
    acc[line] = stations.filter((s) => s.line === line);
    return acc;
  }, {} as Record<TransitLine, TransitStation[]>);

  const toggle = (line: string) =>
    setExpanded((prev) => ({ ...prev, [line]: !prev[line] }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Transit Stations"
        description="All BTS, MRT, ARL and SRT stations grouped by line."
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {TRANSIT_LINES.map((line) => {
            const lineStations = grouped[line];

            if (lineStations.length === 0) return null;

            const color = TRANSIT_LINE_COLORS[line];
            const label = TRANSIT_LINE_LABELS[line];
            const isOpen = expanded[line] ?? false;

            return (
              <div key={line}>
                <button
                  onClick={() => toggle(line)}
                  className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  )}

                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />

                  <span className="text-sm font-semibold text-gray-900 flex-1">{label}</span>

                  <span className="text-xs text-gray-600 font-medium">
                    {lineStations.length} stations
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-2 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {lineStations.map((station) => (
                        <div
                          key={station.id}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                          {station.code && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              {station.code}
                            </span>
                          )}
                          <span className="text-sm text-gray-700 truncate">{station.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {stations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Train className="w-8 h-8 text-gray-300" />
              <p className="text-gray-400 text-sm">No stations found. Run seed to populate.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
