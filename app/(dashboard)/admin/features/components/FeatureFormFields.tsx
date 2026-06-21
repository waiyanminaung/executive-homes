"use client";

import { RHFInput, RHFError, RHFSelect, SelectOption } from "@geckoui/geckoui";
import { useFormContext } from "react-hook-form";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import { classNames } from "@/utils/classNames";
import { LUCIDE_ICON_OPTIONS } from "@/constants/lucideIcons";
import { getLucideIcon } from "@/utils/getLucideIcon";
import { FEATURE_CATEGORIES, type FeatureCreateInput } from "@/validation/featureSchema";

const CATEGORY_LABELS: Record<string, string> = {
  UNIT_FEATURE: "Unit Feature",
  AMENITY: "Amenity",
};

export function FeatureFormFields() {
  const { onBlur: handleLabelBlur } = useSlugAutoFill("label");
  const { watch, setValue } = useFormContext<FeatureCreateInput>();
  const selectedIcon = watch("icon");
  const category = watch("category");
  const isAmenity = category === "AMENITY";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <RHFInput name="label" placeholder="Swimming Pool" onBlur={handleLabelBlur} />
        <RHFError name="label" />
      </div>

      <SlugInput placeholder="swimming-pool" />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <RHFSelect<string> name="category">
          {FEATURE_CATEGORIES.map((cat) => (
            <SelectOption key={cat} value={cat} label={CATEGORY_LABELS[cat] ?? cat} />
          ))}
        </RHFSelect>
        <RHFError name="category" />
      </div>

      {!isAmenity && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Icon</label>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
            <button
              type="button"
              onClick={() => setValue("icon", null)}
              className={classNames(
                "flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-colors",
                !selectedIcon ? "border-primary-500 bg-primary-50 text-primary-700" : "border-transparent hover:border-gray-200 text-gray-500",
              )}
            >
              <span className="text-[10px]">None</span>
            </button>
            {LUCIDE_ICON_OPTIONS.map(({ name, label }) => {
              const Icon = getLucideIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  title={label}
                  onClick={() => setValue("icon", name)}
                  className={classNames(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-colors",
                    selectedIcon === name ? "border-primary-500 bg-primary-50 text-primary-700" : "border-transparent hover:border-gray-200 text-gray-500",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          {selectedIcon && (
            <p className="text-xs text-gray-500">Selected: {selectedIcon}</p>
          )}
        </div>
      )}
    </div>
  );
}
