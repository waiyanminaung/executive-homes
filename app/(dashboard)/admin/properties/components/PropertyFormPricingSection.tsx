"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { RHFCurrencyInput, RHFNumberInput, RHFError, RHFInput, Label, Button } from "@geckoui/geckoui";
import { Trash2, Plus } from "lucide-react";
import type { PropertyCreateInput } from "@/validation/propertySchema";

const THB = { symbol: "฿", code: "THB" };

function PricingTierRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
      <div className="space-y-1.5">
        {index === 0 && <Label>Label</Label>}
        <RHFInput name={`pricingTiers.${index}.label`} placeholder="e.g. Fully Furnished" />
        <RHFError name={`pricingTiers.${index}.label`} />
      </div>

      <div className="space-y-1.5">
        {index === 0 && <Label>Rent / month</Label>}
        <RHFCurrencyInput name={`pricingTiers.${index}.rentPrice`} placeholder="0" currency={THB} />
        <RHFError name={`pricingTiers.${index}.rentPrice`} />
      </div>

      <div className="space-y-1.5">
        {index === 0 && <Label>Sale Price</Label>}
        <RHFCurrencyInput name={`pricingTiers.${index}.salePrice`} placeholder="0" currency={THB} />
        <RHFError name={`pricingTiers.${index}.salePrice`} />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
        aria-label="Remove tier"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PropertyFormPricingSection() {
  const { control } = useFormContext<PropertyCreateInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingTiers",
  });

  const handleAdd = () => {
    append({ label: "", salePrice: null, rentPrice: null, order: fields.length });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Pricing Tiers</h2>

        <Button type="button" variant="outlined" size="sm" onClick={handleAdd} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Tier
        </Button>
      </div>

      <RHFError name="pricingTiers" />

      <div className="space-y-3">
        {fields.map((field, index) => (
          <PricingTierRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 py-2">No pricing tiers yet. Click &quot;Add Tier&quot; to begin.</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
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
