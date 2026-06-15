"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ConfirmDialog, Dialog, Spinner, RHFInput, RHFError, RHFSelect, SelectOption } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRead, useWrite } from "@/lib/spoosh";
import { provinceCreateSchema, districtCreateSchema } from "@/validation/locationSchema";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import type { Province, District } from "@/types/location";
import AdminPageHeader from "../components/AdminPageHeader";

function ProvinceFormFields() {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="Bangkok" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="bangkok" />
    </div>
  );
}

function DistrictFormFields({ provinces }: { provinces: Province[] }) {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="Watthana" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="watthana" />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <RHFSelect<string> name="provinceId" placeholder="Select province...">
          {provinces.map((p) => (
            <SelectOption key={p.id} value={p.id} label={p.name} />
          ))}
        </RHFSelect>
        <RHFError name="provinceId" />
      </div>
    </div>
  );
}

function ProvinceForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing: Province | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/locations/provinces").POST());
  const { trigger: update } = useWrite((api) => api("admin/locations/provinces/:id").PATCH());

  const methods = useForm({
    values: editing ? { name: editing.name, slug: editing.slug } : { name: "", slug: "" },
    resolver: zodResolver(provinceCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await update({ params: { id: editing.id }, body: values });
    } else {
      await create({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit Province" : "Add Province"}</h3>
        <ProvinceFormFields />
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={methods.formState.isSubmitting} className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function DistrictForm({
  editing,
  provinces,
  defaultProvinceId,
  onSaved,
  onCancel,
}: {
  editing: (District & { province: { id: string; name: string } }) | null;
  provinces: Province[];
  defaultProvinceId?: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/locations/districts").POST());
  const { trigger: update } = useWrite((api) => api("admin/locations/districts/:id").PATCH());

  const methods = useForm({
    values: editing
      ? { name: editing.name, slug: editing.slug, provinceId: editing.provinceId }
      : { name: "", slug: "", provinceId: defaultProvinceId ?? "" },
    resolver: zodResolver(districtCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await update({ params: { id: editing.id }, body: values });
    } else {
      await create({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit District" : "Add District"}</h3>
        <DistrictFormFields provinces={provinces} />
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={methods.formState.isSubmitting} className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function AdminLocationsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: provData, loading: provLoading, trigger: refetchProvinces } = useRead((api) => api("admin/locations/provinces").GET());
  const { data: distData, loading: distLoading, trigger: refetchDistricts } = useRead((api) => api("admin/locations/districts").GET());
  const { trigger: deleteProvince } = useWrite((api) => api("admin/locations/provinces/:id").DELETE());
  const { trigger: deleteDistrict } = useWrite((api) => api("admin/locations/districts/:id").DELETE());

  const provinces = provData?.provinces ?? [];
  const districts = distData?.districts ?? [];

  const getDistricts = (provinceId: string) => districts.filter((d) => d.provinceId === provinceId);

  const openProvinceForm = (editing: Province | null = null) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <ProvinceForm
          editing={editing}
          onSaved={() => { dismiss(); refetchProvinces(); refetchDistricts(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const openDistrictForm = (
    editing: (District & { province: { id: string; name: string } }) | null = null,
    defaultProvinceId?: string,
  ) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <DistrictForm
          editing={editing}
          provinces={provinces}
          defaultProvinceId={defaultProvinceId}
          onSaved={() => { dismiss(); refetchProvinces(); refetchDistricts(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const handleDeleteProvince = (province: Province) => {
    ConfirmDialog.show({
      title: "Delete province?",
      content: `"${province.name}" and all its districts will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteProvince({ params: { id: province.id } });
        refetchProvinces();
        refetchDistricts();
      },
    });
  };

  const handleDeleteDistrict = (district: District & { province: { id: string; name: string } }) => {
    ConfirmDialog.show({
      title: "Delete district?",
      content: `"${district.name}" will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteDistrict({ params: { id: district.id } });
        refetchDistricts();
      },
    });
  };

  const loading = provLoading || distLoading;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Locations"
        description="Manage provinces and districts."
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => openProvinceForm()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Province
            </button>
            <button
              onClick={() => openDistrictForm()}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              District
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {provinces.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No provinces yet. Add your first one.</p>
            </div>
          ) : (
            provinces.map((province) => {
              const isOpen = expanded[province.id] ?? false;
              const provinceDistricts = getDistricts(province.id);

              return (
                <div key={province.id}>
                  <div className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [province.id]: !isOpen }))}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm font-semibold text-gray-900">{province.name}</span>
                      <span className="text-xs text-gray-600 font-mono ml-1">{province.slug}</span>
                      <span className="ml-2 text-xs text-gray-600">{provinceDistricts.length} districts</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openDistrictForm(null, province.id)}
                        className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Add district"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openProvinceForm(province)}
                        className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProvince(province)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="pl-10 pr-4 pb-2 space-y-0.5 bg-gray-50">
                      {provinceDistricts.length === 0 ? (
                        <p className="text-xs text-gray-500 py-2">No districts yet.</p>
                      ) : (
                        provinceDistricts.map((district) => (
                          <div key={district.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">{district.name}</span>
                              <span className="text-xs text-gray-600 font-mono">{district.slug}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openDistrictForm(district)}
                                className="p-1 text-gray-500 hover:text-primary-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDistrict(district)}
                                className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
