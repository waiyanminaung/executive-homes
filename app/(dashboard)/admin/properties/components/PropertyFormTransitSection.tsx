"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Train, Trash2 } from "lucide-react";
import { RHFError } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { TRANSIT_LINE_COLORS } from "@/constants/transitStations";
import { openTransitStationPicker } from "@/components/@shared/TransitStationPickerModal";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import type { TransitStation } from "@/types/transitStation";

export default function PropertyFormTransitSection() {
  const { control } = useFormContext<PropertyCreateInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transitStations",
  });

  const { data } = useRead((api) => api("admin/transit-stations").GET());
  const stations = data?.stations ?? [];

  const stationMap = stations.reduce<Record<string, TransitStation>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const currentIds = fields.map((f) => f.stationId);

  const handlePickerConfirm = (selectedIds: string[]) => {
    const currentSet = new Set(currentIds);
    const selectedSet = new Set(selectedIds);

    fields.forEach((field, index) => {
      if (!selectedSet.has(field.stationId)) {
        remove(index);
      }
    });

    selectedIds.forEach((id) => {
      if (!currentSet.has(id)) {
        append({ stationId: id, distanceMeters: 500 });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Transit Proximity</h2>
        <button
          type="button"
          onClick={() =>
            openTransitStationPicker({
              selectedIds: currentIds,
              onConfirm: handlePickerConfirm,
            })
          }
          className="flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:text-primary-800"
        >
          <Train className="w-3.5 h-3.5" />
          Choose Stations
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const station = stationMap[field.stationId];
          const color = station ? TRANSIT_LINE_COLORS[station.line as keyof typeof TRANSIT_LINE_COLORS] : undefined;

          return (
            <div key={field.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 flex items-center gap-2 min-h-[36px]">
                {station?.code && color && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {station.code}
                  </span>
                )}
                <span className="text-sm text-gray-800 truncate">
                  {station?.name ?? field.stationId}
                </span>
                <RHFError name={`transitStations.${index}.stationId`} />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {fields.length === 0 && (
          <p className="text-sm text-gray-400">
            No transit stations added. Click &ldquo;Choose Stations&rdquo; to add.
          </p>
        )}
      </div>
    </div>
  );
}
