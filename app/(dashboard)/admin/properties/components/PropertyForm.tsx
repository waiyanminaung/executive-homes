"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
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

const DEFAULT_VALUES: PropertyCreateInput = {
  title: "",
  slug: "",
  description: "",
  propertyTypeId: "",
  status: "FOR_SALE",
  salePrice: null,
  rentPrice: null,
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
  imageUrls: [],
  featureIds: [],
  transitStations: [],
};

interface PropertyFormProps {
  defaultValues?: Partial<PropertyCreateInput>;
  provinces: Province[];
  onSubmit: (values: PropertyCreateInput) => Promise<void>;
  submitLabel: string;
}

export default function PropertyForm({
  defaultValues,
  provinces,
  onSubmit,
  submitLabel,
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <PropertyFormBasicSection />
            <PropertyFormPricingSection />
            <PropertyFormLocationSection provinces={provinces} />
            <PropertyFormFeaturesSection />
            <PropertyFormTransitSection />
            <PropertyFormMediaSection />
          </div>
          <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
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
