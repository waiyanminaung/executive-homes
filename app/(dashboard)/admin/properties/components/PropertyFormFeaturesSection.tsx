"use client";

import { useFormContext } from "react-hook-form";
import { RHFCheckbox, Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import type { Feature } from "@/types/feature";

interface FeatureGroupProps {
  label: string;
  features: Feature[];
}

function FeatureGroup({ label, features }: FeatureGroupProps) {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const featureIds = watch("featureIds");
  const groupIds = features.map((f) => f.id);
  const allSelected = groupIds.every((id) => featureIds.includes(id));

  const toggleAll = () => {
    if (allSelected) {
      setValue("featureIds", featureIds.filter((id) => !groupIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...featureIds, ...groupIds]));
      setValue("featureIds", merged);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{label}</p>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {features.map((f) => (
          <RHFCheckbox key={f.id} name="featureIds" value={f.id} label={f.label} />
        ))}
      </div>
    </div>
  );
}

export default function PropertyFormFeaturesSection() {
  const { data, loading } = useRead((api) => api("admin/features").GET());
  const features = data?.features ?? [];

  const unitFeatures = features.filter((f) => f.category === "UNIT_FEATURE");
  const amenities = features.filter((f) => f.category === "AMENITY");

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
            <FeatureGroup label="Unit Features" features={unitFeatures} />
          )}

          {amenities.length > 0 && (
            <FeatureGroup label="Amenities" features={amenities} />
          )}

          {features.length === 0 && (
            <p className="text-sm text-gray-400">No features available. Add features in the Features section first.</p>
          )}
        </div>
      )}
    </div>
  );
}
