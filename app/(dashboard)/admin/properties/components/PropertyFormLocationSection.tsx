"use client";

import { RHFInput, RHFSelect, RHFError, SelectOption } from "@geckoui/geckoui";
import type { Province } from "@/types/property";

interface PropertyFormLocationSectionProps {
  provinces: Province[];
}

export default function PropertyFormLocationSection({ provinces }: PropertyFormLocationSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Location</h2>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <RHFInput name="address" placeholder="Street address, building name..." />
        <RHFError name="address" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <RHFSelect<string> name="provinceId">
          {provinces.map((p) => (
            <SelectOption key={p.id} value={p.id} label={p.name} />
          ))}
        </RHFSelect>
        <RHFError name="provinceId" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Map Image URL (optional)</label>
        <RHFInput name="mapImageUrl" placeholder="https://..." />
        <RHFError name="mapImageUrl" />
      </div>
    </div>
  );
}
