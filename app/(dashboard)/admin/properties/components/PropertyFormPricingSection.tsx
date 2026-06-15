"use client";

import { RHFCurrencyInput, RHFNumberInput, RHFError } from "@geckoui/geckoui";

const THB = { symbol: "฿", code: "THB" };

export default function PropertyFormPricingSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Pricing & Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Sale Price</label>
          <RHFCurrencyInput name="salePrice" placeholder="0" currency={THB} />
          <RHFError name="salePrice" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Rent Price / month</label>
          <RHFCurrencyInput name="rentPrice" placeholder="0" currency={THB} />
          <RHFError name="rentPrice" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <RHFNumberInput name="beds" placeholder="0" min={0} />
          <RHFError name="beds" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <RHFNumberInput name="baths" placeholder="0" min={0} />
          <RHFError name="baths" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Area</label>
          <RHFNumberInput name="areaSqm" placeholder="0" suffix="sqm" min={0} />
          <RHFError name="areaSqm" />
        </div>
      </div>
    </div>
  );
}
