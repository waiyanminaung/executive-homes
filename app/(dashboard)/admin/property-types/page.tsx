"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, Dialog, Spinner, RHFInput, RHFError } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRead, useWrite } from "@/lib/spoosh";
import { propertyTypeCreateSchema, type PropertyTypeCreateInput } from "@/validation/propertyTypeSchema";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import type { PropertyTypeItem } from "@/types/propertyType";
import AdminPageHeader from "../components/AdminPageHeader";

function PropertyTypeFormFields() {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="e.g. Condo" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="condo" />
    </div>
  );
}

function PropertyTypeForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing: PropertyTypeItem | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/property-types").POST());
  const { trigger: update } = useWrite((api) => api("admin/property-types/:id").PATCH());

  const methods = useForm<PropertyTypeCreateInput>({
    values: editing ? { name: editing.name, slug: editing.slug } : { name: "", slug: "" },
    resolver: zodResolver(propertyTypeCreateSchema),
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
        <h3 className="text-base font-semibold text-gray-900">
          {editing ? "Edit Property Type" : "Add Property Type"}
        </h3>
        <PropertyTypeFormFields />
        <div className="flex gap-2 justify-end pt-1">
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

export default function AdminPropertyTypesPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/property-types").GET());
  const { trigger: deleteType } = useWrite((api) => api("admin/property-types/:id").DELETE());

  const propertyTypes = data?.propertyTypes ?? [];

  const openForm = (editing: PropertyTypeItem | null = null) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <PropertyTypeForm
          editing={editing}
          onSaved={() => { dismiss(); refetch(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const handleDelete = (pt: PropertyTypeItem) => {
    ConfirmDialog.show({
      title: "Delete property type?",
      content: `"${pt.name}" will be permanently deleted. Properties using this type must be updated first.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteType({ params: { id: pt.id } });
        refetch();
      },
    });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Property Types"
        description="Manage property categories shown to users."
        actions={
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {propertyTypes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No property types yet. Add your first one.</p>
            </div>
          ) : (
            propertyTypes.map((pt) => (
              <div key={pt.id} className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{pt.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{pt.slug}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openForm(pt)}
                    className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pt)}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
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
}
