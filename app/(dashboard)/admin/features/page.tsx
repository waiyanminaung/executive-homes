"use client";

import { createElement } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button, Checkbox, ConfirmDialog, Dialog, Spinner, toast } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { getLucideIcon } from "@/utils/getLucideIcon";
import type { Feature } from "@/types/feature";
import { useBulkSelect } from "@/utils/useBulkSelect";
import AdminPageHeader from "../components/AdminPageHeader";
import FeatureForm from "./components/FeatureForm";

function FeatureIconCell({ icon }: { icon: string | null | undefined }) {
  if (!icon) return <span className="text-gray-300 text-xs">—</span>;
  return createElement(getLucideIcon(icon), { className: "w-4 h-4 text-gray-600" });
}

export default function AdminFeaturesPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/features").GET());
  const { trigger: deleteFeature } = useWrite((api) => api("admin/features/:id").DELETE());
  const { trigger: bulkDeleteFeatures } = useWrite((api) => api("admin/features/bulk").DELETE());

  const { selectedIds, toggleSelect, toggleAll, clearSelection } = useBulkSelect();

  const features = data?.features ?? [];
  const unitFeatures = features.filter((f) => f.category === "UNIT_FEATURE");
  const commonFacilities = features.filter((f) => f.category === "AMENITY");
  const grouped = [
    { label: "Unit Features", category: "UNIT_FEATURE", features: unitFeatures },
    { label: "Amenities", category: "AMENITY", features: commonFacilities },
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

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);

    ConfirmDialog.show({
      title: `Delete ${ids.length} feature${ids.length > 1 ? "s" : ""}?`,
      content: `${ids.length} feature${ids.length > 1 ? "s" : ""} will be permanently deleted and cannot be recovered.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        try {
          await bulkDeleteFeatures({ body: { ids } });
          refetch();
          clearSelection();
          toast.success(`${ids.length} feature${ids.length > 1 ? "s" : ""} deleted`);
        } catch {
          toast.error("Failed to delete features");
        }
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

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-xl">
          <span className="text-sm font-medium text-primary-700 mr-1">{selectedIds.size} selected</span>
          <Button
            type="button"
            size="sm"
            variant="outlined"
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
          </Button>
          <button type="button" onClick={clearSelection} className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            grouped.map((group) => {
              const showIcon = group.category !== "AMENITY";
              const groupIds = group.features.map((f) => f.id);
              const allGroupSelected = groupIds.length > 0 && groupIds.every((id) => selectedIds.has(id));

              return (
                <div key={group.label} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.label}</p>
                  </div>
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-white">
                      <tr>
                        <th className="pl-4 pr-0 py-3 w-10">
                          <Checkbox checked={allGroupSelected} onChange={() => toggleAll(groupIds)} />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</th>
                        {showIcon && (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Icon</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slug</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.features.map((feature) => (
                        <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                          <td className="pl-4 pr-0 py-4 w-10">
                            <Checkbox checked={selectedIds.has(feature.id)} onChange={() => toggleSelect(feature.id)} />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.label}</td>
                          {showIcon && (
                            <td className="px-6 py-4">
                              <FeatureIconCell icon={feature.icon} />
                            </td>
                          )}
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
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
