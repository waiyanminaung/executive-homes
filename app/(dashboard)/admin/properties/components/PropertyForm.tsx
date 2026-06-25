"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import {
  propertyCreateSchema,
  type PropertyCreateInput,
} from "@/validation/propertySchema";
import type { Province } from "@/types/property";
import PropertyFormBasicSection from "./PropertyFormBasicSection";
import PropertyFormPricingSection from "./PropertyFormPricingSection";
import PropertyFormLocationSection from "./PropertyFormLocationSection";
import PropertyFormMediaSection from "./PropertyFormMediaSection";
import PropertyFormFlagsSection from "./PropertyFormFlagsSection";
import PropertyFormFeaturesSection from "./PropertyFormFeaturesSection";
import PropertyFormTransitSection from "./PropertyFormTransitSection";
import PropertyFormDetailsSection from "./PropertyFormDetailsSection";

const DEFAULT_VALUES: PropertyCreateInput = {
  title: "",
  slug: "",
  description: "",
  propertyTypeId: "",
  isForSale: false,
  isForRent: false,
  availabilityStatus: "AVAILABLE",
  pricingTiers: [],
  beds: null,
  baths: null,
  areaSqm: 0,
  address: "",
  provinceId: "",
  districtId: null,
  subDistrictId: null,
  lat: null,
  lng: null,
  mapImageUrl: null,
  isFeatured: false,
  isPublished: false,
  isPetFriendly: false,
  imageUrls: [],
  featureIds: [],
  transitStations: [],
};

interface PropertyFormProps {
  defaultValues?: Partial<PropertyCreateInput>;
  provinces: Province[];
  onSubmit: (values: PropertyCreateInput) => Promise<void>;
  submitLabel: string;
  onTitleChange?: (title: string) => void;
}

function TitleWatcher({ onTitleChange }: { onTitleChange: (title: string) => void }) {
  const title = useWatch<PropertyCreateInput, "title">({ name: "title" });

  useEffect(() => {
    onTitleChange(title ?? "");
  }, [title, onTitleChange]);

  return null;
}

export default function PropertyForm({
  defaultValues,
  provinces,
  onSubmit,
  submitLabel,
  onTitleChange,
}: PropertyFormProps) {
  const methods = useForm({
    values: { ...DEFAULT_VALUES, ...defaultValues } as PropertyCreateInput,
    resolver: zodResolver(propertyCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await onSubmit(values as PropertyCreateInput);
  });

  return (
    <FormProvider {...methods}>
      {onTitleChange && <TitleWatcher onTitleChange={onTitleChange} />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <PropertyFormBasicSection />
            <PropertyFormPricingSection />
            <PropertyFormDetailsSection />
            <PropertyFormLocationSection provinces={provinces} />
            <PropertyFormFeaturesSection />
            <PropertyFormTransitSection />
            <PropertyFormMediaSection />
          </div>
          <div className="space-y-5 lg:sticky lg:top-0 lg:self-start">
            <PropertyFormFlagsSection submitLabel={submitLabel} />
          </div>
        </div>

        {methods.formState.errors.root ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {methods.formState.errors.root.message}
          </p>
        ) : null}
      </form>
    </FormProvider>
  );
}
