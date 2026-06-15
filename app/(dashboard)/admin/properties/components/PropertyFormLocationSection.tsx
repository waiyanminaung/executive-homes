"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RHFInput, RHFSelect, RHFError, SelectOption } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import type { Province } from "@/types/property";
import type { PropertyCreateInput } from "@/validation/propertySchema";

interface PropertyFormLocationSectionProps {
  provinces: Province[];
}

export default function PropertyFormLocationSection({ provinces }: PropertyFormLocationSectionProps) {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const lat = watch("lat");
  const lng = watch("lng");
  const provinceId = watch("provinceId");
  const hasCoords = lat != null && lng != null;

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  useEffect(() => {
    setValue("districtId", null);
  }, [provinceId, setValue]);

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
        <RHFSelect<string> name="provinceId" placeholder="Select province...">
          {provinces.map((p) => (
            <SelectOption key={p.id} value={p.id} label={p.name} />
          ))}
        </RHFSelect>
        <RHFError name="provinceId" />
      </div>

      {provinceId && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">District</label>
          <RHFSelect<string> name="districtId" placeholder="Select district...">
            {districts.map((d) => (
              <SelectOption key={d.id} value={d.id} label={d.name} />
            ))}
          </RHFSelect>
          <RHFError name="districtId" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <RHFInput name="lat" placeholder="e.g. 13.7563" type="number" step="any" />
          <RHFError name="lat" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <RHFInput name="lng" placeholder="e.g. 100.5018" type="number" step="any" />
          <RHFError name="lng" />
        </div>
      </div>

      {hasCoords && (
        <div className="rounded-lg overflow-hidden border border-gray-200 h-56">
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Map Image URL (optional)</label>
        <RHFInput name="mapImageUrl" placeholder="https://..." />
        <RHFError name="mapImageUrl" />
      </div>
    </div>
  );
}
