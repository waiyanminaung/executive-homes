"use client";

import { RHFCheckbox, Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";

export default function PropertyFormFeaturesSection() {
  const { data, loading } = useRead((api) => api("admin/features").GET());
  const features = data?.features ?? [];

  const unitFeatures = features.filter((f) => f.category === "UNIT_FEATURE");
  const commonFacilities = features.filter((f) => f.category === "AMENITY");

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
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Unit Features</p>
              <div className="grid grid-cols-2 gap-2">
                {unitFeatures.map((f) => (
                  <RHFCheckbox key={f.id} name="featureIds" value={f.id} label={f.label} />
                ))}
              </div>
            </div>
          )}

          {commonFacilities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {commonFacilities.map((f) => (
                  <RHFCheckbox key={f.id} name="featureIds" value={f.id} label={f.label} />
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
