"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Spinner, RHFError, SelectOption, RHFSelect, RHFNumberInput } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { TRANSIT_LINE_LABELS } from "@/constants/transitStations";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormTransitSection() {
  const { control } = useFormContext<PropertyCreateInput>();

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
                <RHFSelect<string>
                  name={`transitStations.${index}.stationId`}
                  filterable="dropdown"
                  placeholder="Search station..."
                >
                  {Object.entries(grouped).map(([line, lineStations]) => (
                    <optgroup key={line} label={TRANSIT_LINE_LABELS[line as keyof typeof TRANSIT_LINE_LABELS] ?? line}>
                      {lineStations.map((s) => (
                        <SelectOption key={s.id} value={s.id} label={s.code ? `${s.code} – ${s.name}` : s.name} />
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
                <RHFError name={`transitStations.${index}.stationId`} />
              </div>

              <div className="w-36 space-y-1.5">
                <RHFNumberInput
                  name={`transitStations.${index}.distanceMeters`}
                  placeholder="500"
                  suffix="m"
                  min={1}
                  max={9999}
                />
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
