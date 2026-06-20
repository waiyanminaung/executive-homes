"use client";

import { createElement } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, Dialog, Spinner } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRead, useWrite } from "@/lib/spoosh";
import { featureCreateSchema, type FeatureCreateInput } from "@/validation/featureSchema";
import { getLucideIcon } from "@/utils/getLucideIcon";
import type { Feature } from "@/types/feature";
import AdminPageHeader from "../components/AdminPageHeader";
import { FeatureFormFields } from "./components/FeatureFormFields";

const DEFAULT_VALUES: FeatureCreateInput = { label: "", slug: "", category: "UNIT_FEATURE", icon: null };

function FeatureIconCell({ icon }: { icon: string | null | undefined }) {
  if (!icon) return <span className="text-gray-300 text-xs">—</span>;
  return createElement(getLucideIcon(icon), { className: "w-4 h-4 text-gray-600" });
}

function FeatureForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing: Feature | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: createFeature } = useWrite((api) => api("admin/features").POST());
  const { trigger: updateFeature } = useWrite((api) => api("admin/features/:id").PATCH());

  const methods = useForm({
    values: editing
      ? { label: editing.label, slug: editing.slug, category: editing.category as FeatureCreateInput["category"], icon: editing.icon ?? null }
      : DEFAULT_VALUES,
    resolver: zodResolver(featureCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await updateFeature({ params: { id: editing.id }, body: values });
    } else {
      await createFeature({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit Feature" : "Add Feature"}</h3>

        <FeatureFormFields />

        <div className="flex items-center gap-2 justify-end pt-1">
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
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function AdminFeaturesPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/features").GET());
  const { trigger: deleteFeature } = useWrite((api) => api("admin/features/:id").DELETE());

  const features = data?.features ?? [];

  const unitFeatures = features.filter((f) => f.category === "UNIT_FEATURE");
  const commonFacilities = features.filter((f) => f.category === "AMENITY");
  const grouped = [
    { label: "Unit Features", features: unitFeatures },
    { label: "Amenities", features: commonFacilities },
  ].filter((g) => g.features.length > 0);

  const openForm = (editing: Feature | null = null) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <FeatureForm
          editing={editing}
          onSaved={() => { dismiss(); refetch(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const handleDelete = (feature: Feature) => {
    ConfirmDialog.show({
      title: "Delete feature?",
      content: `"${feature.label}" will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteFeature({ params: { id: feature.id } });
        refetch();
      },
    });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Features"
        description="Manage property amenities and features."
        actions={
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {features.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
              <p className="text-gray-400 text-sm">No features yet. Add your first one.</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.label} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.label}</p>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Icon</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group.features.map((feature) => (
                      <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.label}</td>
                        <td className="px-6 py-4">
                          <FeatureIconCell icon={feature.icon} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{feature.slug}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openForm(feature)}
                              className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(feature)}
                              className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
