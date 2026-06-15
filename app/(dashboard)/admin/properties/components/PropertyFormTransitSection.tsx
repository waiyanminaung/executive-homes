"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Spinner, RHFError, SelectOption, RHFSelect } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";

const LINE_LABELS: Record<string, string> = {
  BTS_SUKHUMVIT: "BTS Sukhumvit",
  BTS_SILOM: "BTS Silom",
  MRT_BLUE: "MRT Blue",
  MRT_PURPLE: "MRT Purple",
  ARL: "Airport Rail Link",
  BRT: "BRT",
};

export default function PropertyFormTransitSection() {
  const { control, register } = useFormContext<PropertyCreateInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transitStations",
  });

  const { data, loading } = useRead((api) => api("admin/transit-stations").GET());
  const stations = data?.stations ?? [];

  const grouped = stations.reduce<Record<string, typeof stations>>((acc, s) => {
    if (!acc[s.line]) acc[s.line] = [];
    acc[s.line].push(s);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Transit Proximity</h2>
        <button
          type="button"
          onClick={() => append({ stationId: "", distanceMeters: 500 })}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:text-primary-800"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Station
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Spinner className="w-5 h-5 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-1.5">
                <RHFSelect<string> name={`transitStations.${index}.stationId`}>
                  <SelectOption value="" label="Select station..." />
                  {Object.entries(grouped).map(([line, lineStations]) => (
                    <optgroup key={line} label={LINE_LABELS[line] ?? line}>
                      {lineStations.map((s) => (
                        <SelectOption key={s.id} value={s.id} label={s.name} />
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
                <RHFError name={`transitStations.${index}.stationId`} />
              </div>

              <div className="w-32 space-y-1.5">
                <div className="flex items-center gap-1">
                  <input
                    {...register(`transitStations.${index}.distanceMeters`)}
                    type="number"
                    min={1}
                    max={9999}
                    placeholder="500"
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">m</span>
                </div>
                <RHFError name={`transitStations.${index}.distanceMeters`} />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-sm text-gray-400">No transit stations added.</p>
          )}
        </div>
      )}
    </div>
  );
}
