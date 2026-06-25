"use client";

import { RHFNumberInput, RHFError, Label } from "@geckoui/geckoui";

export default function PropertyFormDetailsSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Property Details</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Bedrooms</Label>
          <RHFNumberInput name="beds" placeholder="0" min={0} />
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
