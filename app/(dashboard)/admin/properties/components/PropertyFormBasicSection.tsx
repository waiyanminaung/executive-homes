"use client";

import { RHFInput, RHFTextarea, RHFSelect, RHFError, SelectOption, Spinner } from "@geckoui/geckoui";
import { LISTING_STATUSES } from "@/validation/propertySchema";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import { useRead } from "@/lib/spoosh";

const LISTING_STATUS_LABELS: Record<string, string> = {
  FOR_SALE: "For Sale",
  FOR_RENT: "For Rent",
  FOR_SALE_AND_RENT: "For Sale & Rent",
  SOLD: "Sold",
  RENTED: "Rented",
  OFF_MARKET: "Off Market",
};

export default function PropertyFormBasicSection() {
  const { onBlur: handleTitleBlur } = useSlugAutoFill("title");
  const { data, loading } = useRead((api) => api("admin/property-types").GET());
  const propertyTypes = data?.propertyTypes ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <RHFInput name="title" placeholder="e.g. Modern Condo at Sukhumvit 11" onBlur={handleTitleBlur} />
        <RHFError name="title" />
      </div>

      <SlugInput placeholder="modern-condo-sukhumvit-11" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          {loading ? (
            <div className="flex items-center h-10">
              <Spinner className="w-4 h-4 text-primary-600" />
            </div>
          ) : (
            <RHFSelect<string> name="propertyTypeId" placeholder="Select type...">
              {propertyTypes.map((pt) => (
                <SelectOption key={pt.id} value={pt.id} label={pt.name} />
              ))}
            </RHFSelect>
          )}
          <RHFError name="propertyTypeId" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Listing Status</label>
          <RHFSelect<string> name="status">
            {LISTING_STATUSES.map((status) => (
              <SelectOption key={status} value={status} label={LISTING_STATUS_LABELS[status] ?? status} />
            ))}
          </RHFSelect>
          <RHFError name="status" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <RHFTextarea name="description" placeholder="Describe the property..." rows={4} />
        <RHFError name="description" />
      </div>
    </div>
  );
}
