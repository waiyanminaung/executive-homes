"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWrite } from "@/lib/spoosh";
import { featureCreateSchema, type FeatureCreateInput } from "@/validation/featureSchema";
import type { Feature } from "@/types/feature";
import { FeatureFormFields } from "./FeatureFormFields";

const DEFAULT_VALUES: FeatureCreateInput = { label: "", slug: "", category: "UNIT_FEATURE", icon: null };

interface FeatureFormProps {
  editing: Feature | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function FeatureForm({ editing, onSaved, onCancel }: FeatureFormProps) {
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
