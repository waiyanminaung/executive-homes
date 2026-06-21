"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmDialog, RHFInput, RHFSelect, RHFError, SelectOption, RHFNumberInput } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { homeSectionCreateSchema, type HomeSectionCreateInput } from "@/validation/homeSectionSchema";
import type { HomeSection } from "@/types/homeSection";

const DEFAULT_VALUES: HomeSectionCreateInput = {
  title: "",
  propertyTypeId: null,
  listingType: "BOTH",
  provinceId: null,
  districtId: null,
  limit: 8,
  order: 0,
};

const LISTING_TYPE_OPTIONS = [
  { value: "BOTH", label: "Both (Rent & Sale)" },
  { value: "RENT", label: "For Rent" },
  { value: "SALE", label: "For Sale" },
] as const;

interface HomeSectionFormProps {
  section: HomeSection | null;
  onSaved: () => void;
  onCancel: () => void;
  onDeleted?: () => void;
}

export default function HomeSectionForm({ section, onSaved, onCancel, onDeleted }: HomeSectionFormProps) {
  const { data: propertyTypesData } = useRead((api) => api("admin/property-types").GET());
  const { data: provincesData } = useRead((api) => api("admin/provinces").GET());

  const propertyTypes = propertyTypesData?.propertyTypes ?? [];
  const provinces = provincesData?.provinces ?? [];

  const { trigger: createSection } = useWrite((api) => api("admin/home-sections").POST());
  const { trigger: updateSection } = useWrite((api) => api("admin/home-sections/:id").PATCH());
  const { trigger: deleteSection } = useWrite((api) => api("admin/home-sections/:id").DELETE());

  const methods = useForm<HomeSectionCreateInput>({
    values: section
      ? {
          title: section.title,
          propertyTypeId: section.propertyTypeId,
          listingType: section.listingType,
          provinceId: section.provinceId,
          districtId: section.districtId,
          limit: section.limit,
          order: section.order,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(homeSectionCreateSchema),
  });

  const provinceId = methods.watch("provinceId");

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (section) {
      await updateSection({ params: { id: section.id }, body: values });
    } else {
      await createSection({ body: values });
    }
    onSaved();
  });

  const handleDelete = () => {
    if (!section) return;
    ConfirmDialog.show({
      title: "Delete section?",
      content: `"${section.title}" will be permanently removed from the home page.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteSection({ params: { id: section.id } });
        onDeleted?.();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="p-5 border-t border-gray-100 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <RHFInput name="title" placeholder="e.g. Condos for Rent in Bangkok" />
            <RHFError name="title" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Listing Type</label>
            <RHFSelect<string> name="listingType">
              {LISTING_TYPE_OPTIONS.map((opt) => (
                <SelectOption key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </RHFSelect>
            <RHFError name="listingType" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <RHFSelect<string> name="propertyTypeId" placeholder="Any type">
              {propertyTypes.map((pt) => (
                <SelectOption key={pt.id} value={pt.id} label={pt.name} />
              ))}
            </RHFSelect>
            <RHFError name="propertyTypeId" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <RHFSelect<string> name="provinceId" placeholder="Any province" onChange={() => methods.setValue("districtId", null)}>
              {provinces.map((p) => (
                <SelectOption key={p.id} value={p.id} label={p.name} />
              ))}
            </RHFSelect>
            <RHFError name="provinceId" />
          </div>

          {provinceId && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <RHFSelect<string> name="districtId" placeholder="Any district">
                {districts.map((d) => (
                  <SelectOption key={d.id} value={d.id} label={d.name} />
                ))}
              </RHFSelect>
              <RHFError name="districtId" />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Max Properties</label>
            <RHFNumberInput name="limit" min={1} max={50} />
            <RHFError name="limit" />
          </div>

        </div>

        <div className="flex items-center justify-between pt-1">
          {section ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {methods.formState.isSubmitting ? "Saving..." : section ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
