"use client";

import { RHFNumberInput, RHFError, RHFSelect, SelectOption, Label } from "@geckoui/geckoui";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";

export default function PropertyFormDetailsSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Property Details</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Bedrooms</Label>
          <RHFSelect name="beds" placeholder="Select">
            {HOME_HERO_FILTER_OPTIONS.bedrooms.map((o) => (
              <SelectOption key={o.value} value={o.value} label={o.label} />
            ))}
          </RHFSelect>
          <RHFError name="beds" />
        </div>

        <div className="space-y-1.5">
          <Label>Bathrooms</Label>
          <RHFNumberInput name="baths" placeholder="0" min={0} />
          <RHFError name="baths" />
        </div>

        <div className="space-y-1.5">
          <Label required>Area</Label>
          <RHFNumberInput name="areaSqm" placeholder="0" suffix="sqm" min={0} />
          <RHFError name="areaSqm" />
        </div>
      </div>
    </div>
  );
}
