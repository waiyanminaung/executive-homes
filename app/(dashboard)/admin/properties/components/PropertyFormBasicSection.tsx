"use client";

import { RHFInput, RHFController, RHFSelect, RHFError, RHFSwitch, SelectOption, Spinner, Label } from "@geckoui/geckoui";
import TiptapEditor from "@/components/TiptapEditor";
import { AVAILABILITY_STATUSES } from "@/validation/propertySchema";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import { useRead } from "@/lib/spoosh";

const AVAILABILITY_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  RENTED: "Rented",
};

export default function PropertyFormBasicSection() {
  const { onBlur: handleTitleBlur } = useSlugAutoFill("title");
  const { data, loading } = useRead((api) => api("admin/property-types").GET());
  const propertyTypes = data?.propertyTypes ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>

      <div className="space-y-1.5">
        <Label required>Title</Label>
        <RHFInput name="title" placeholder="e.g. Modern Condo at Sukhumvit 11" onBlur={handleTitleBlur} />
        <RHFError name="title" />
      </div>

      <SlugInput placeholder="modern-condo-sukhumvit-11" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Property Type</Label>
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
          <Label required>Availability</Label>
          <RHFSelect<string> name="availabilityStatus">
            {AVAILABILITY_STATUSES.map((status) => (
              <SelectOption key={status} value={status} label={AVAILABILITY_LABELS[status] ?? status} />
            ))}
          </RHFSelect>
          <RHFError name="availabilityStatus" />
        </div>
      </div>

      <div className="space-y-3">
        <Label required>Listed As</Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2.5">
            <RHFSwitch name="isForSale" />
            <span className="text-sm text-gray-700">For Sale</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <RHFSwitch name="isForRent" />
            <span className="text-sm text-gray-700">For Rent</span>
          </label>
        </div>
        <RHFError name="isForSale" />
      </div>

      <div className="space-y-3">
        <Label>Property Attributes</Label>
        <label className="inline-flex cursor-pointer items-center gap-2.5">
          <RHFSwitch name="isPetFriendly" />
          <span className="text-sm text-gray-700">Pet Friendly</span>
        </label>
      </div>

      <div className="space-y-1.5">
        <Label required>Description</Label>
        <RHFController
          name="description"
          render={({ field, fieldState }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Describe the property..."
              hasError={!!fieldState.error}
            />
          )}
        />
        <RHFError name="description" />
      </div>
    </div>
  );
}
