"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Search, Train, X } from "lucide-react";
import { Dialog, Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import {
  TRANSIT_LINES,
  TRANSIT_LINE_COLORS,
  TRANSIT_LINE_LABELS,
  type TransitLine,
} from "@/constants/transitStations";
import { classNames } from "@/utils/classNames";
import type { TransitStation } from "@/types/transitStation";

interface TransitStationPickerModalProps {
  selectedIds: string[];
  onConfirm?: (ids: string[]) => void;
  onConfirmWithStations?: (stations: { id: string; name: string }[]) => void;
  dismiss: () => void;
  multiple?: boolean;
  endpoint?: "admin/transit-stations" | "transit-stations";
}

export function openTransitStationPicker(opts: {
  selectedIds: string[];
  onConfirm?: (ids: string[]) => void;
  onConfirmWithStations?: (stations: { id: string; name: string }[]) => void;
  multiple?: boolean;
  endpoint?: "admin/transit-stations" | "transit-stations";
}) {
  Dialog.show({
    className: "w-full max-w-2xl p-0 overflow-hidden",
    content: ({ dismiss }) => (
      <TransitStationPickerModal
        selectedIds={opts.selectedIds}
        onConfirm={opts.onConfirm ? (ids) => { opts.onConfirm!(ids); dismiss(); } : () => dismiss()}
        onConfirmWithStations={opts.onConfirmWithStations ? (stations) => {
          opts.onConfirmWithStations!(stations);
          dismiss();
        } : undefined}
        dismiss={dismiss}
        multiple={opts.multiple}
        endpoint={opts.endpoint}
      />
    ),
  });
}

export default function TransitStationPickerModal({
  selectedIds,
  onConfirm,
  onConfirmWithStations,
  dismiss,
  multiple = true,
  endpoint = "admin/transit-stations",
}: TransitStationPickerModalProps) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, loading } = useRead((api) =>
    endpoint === "transit-stations"
      ? api("transit-stations").GET()
      : api("admin/transit-stations").GET(),
  );
  const stations = data?.stations ?? [];

  const grouped = TRANSIT_LINES.reduce<Record<TransitLine, TransitStation[]>>(
    (acc, line) => {
      acc[line] = stations.filter((s) => s.line === line);
      return acc;
    },
    {} as Record<TransitLine, TransitStation[]>,
  );

  const toggle = (line: string) =>
    setExpanded((prev) => ({ ...prev, [line]: !prev[line] }));

  const toggleStation = (id: string) => {
    setLocalSelected((prev) => {
      const next = new Set(prev);

      if (!multiple) {
        next.clear();
        if (!prev.has(id)) next.add(id);
        return next;
      }

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const q = search.toLowerCase().trim();

  const filteredGrouped = TRANSIT_LINES.reduce<Record<TransitLine, TransitStation[]>>(
    (acc, line) => {
      acc[line] = q
        ? grouped[line].filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              (s.code?.toLowerCase() ?? "").includes(q),
          )
        : grouped[line];
      return acc;
    },
    {} as Record<TransitLine, TransitStation[]>,
  );

  const hasNoResults =
    q.length > 0 && TRANSIT_LINES.every((line) => filteredGrouped[line].length === 0);

  return (
    <div className="flex flex-col max-h-[80vh]">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0">
          <Train className="w-4 h-4 text-primary-600" />
        </div>

        <h2 className="text-sm font-bold text-gray-900 flex-1 truncate">Select Transit Stations</h2>

        <button
          type="button"
          onClick={dismiss}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : hasNoResults ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-sm text-gray-400">No stations match &ldquo;{search}&rdquo;</p>
          </div>
        ) : stations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Train className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400">No stations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {TRANSIT_LINES.map((line) => {
              const lineStations = filteredGrouped[line];

              if (lineStations.length === 0) return null;

              const color = TRANSIT_LINE_COLORS[line];
              const label = TRANSIT_LINE_LABELS[line];
              const isOpen = expanded[line] ?? false;
              const selectedCount = lineStations.filter((s) => localSelected.has(s.id)).length;

              return (
                <div key={line}>
                  <button
                    type="button"
                    onClick={() => toggle(line)}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm font-semibold text-gray-900 flex-1">{label}</span>

                    {selectedCount > 0 && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {selectedCount}
                      </span>
                    )}

                    <span className="text-xs text-gray-500">{lineStations.length} stations</span>

                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {lineStations.map((station) => {
                          const isSelected = localSelected.has(station.id);

                          return (
                            <button
                              key={station.id}
                              type="button"
                              onClick={() => toggleStation(station.id)}
                              className={classNames(
                                "flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-left transition-all w-full cursor-pointer",
                                isSelected
                                  ? ""
                                  : "bg-white border-gray-200 hover:border-gray-300",
                              )}
                              style={
                                isSelected
                                  ? { backgroundColor: `${color}18`, borderColor: color }
                                  : undefined
                              }
                            >
                              {station.code && (
                                <span
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                                  style={{ backgroundColor: color }}
                                >
                                  {station.code}
                                </span>
                              )}

                              <span className="text-xs text-gray-700 truncate flex-1">
                                {station.name}
                              </span>

                              {isSelected && (
                                <Check className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-white">
        <span className="flex-1 text-sm text-gray-500">
          {localSelected.size > 0
            ? `${localSelected.size} station${localSelected.size > 1 ? "s" : ""} selected`
            : "None selected"}
        </span>

        <button
          type="button"
          onClick={dismiss}
          className="py-2.5 px-5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            const ids = Array.from(localSelected);

            if (onConfirmWithStations) {
              const selected = stations
                .filter((s) => localSelected.has(s.id))
                .map((s) => ({ id: s.id, name: s.name }));
              onConfirmWithStations(selected);
            } else {
              onConfirm?.(ids);
            }
          }}
          className="py-2.5 px-5 rounded-xl bg-primary-700 text-sm font-semibold text-white hover:bg-primary-800 active:bg-primary-900 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
