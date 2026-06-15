"use client";

import { useFormContext } from "react-hook-form";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormFeaturesSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const selectedIds = watch("featureIds") ?? [];

  const { data, loading } = useRead((api) => api("admin/features").GET());
  const features = data?.features ?? [];

  const unitFeatures = features.filter((f) => f.category === "UNIT_FEATURE");
  const commonFacilities = features.filter((f) => f.category === "COMMON_FACILITY");

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setValue("featureIds", selectedIds.filter((fid) => fid !== id), { shouldValidate: true });
    } else {
      setValue("featureIds", [...selectedIds, id], { shouldValidate: true });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Features & Amenities</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="w-5 h-5 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {unitFeatures.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Features</p>
              <div className="grid grid-cols-2 gap-2">
                {unitFeatures.map((f) => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(f.id)}
                      onChange={() => toggle(f.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {commonFacilities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Common Facilities</p>
              <div className="grid grid-cols-2 gap-2">
                {commonFacilities.map((f) => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(f.id)}
                      onChange={() => toggle(f.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {features.length === 0 && (
            <p className="text-sm text-gray-400">No features available. Add features in the Features section first.</p>
          )}
        </div>
      )}
    </div>
  );
}
