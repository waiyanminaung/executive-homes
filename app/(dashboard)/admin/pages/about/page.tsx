"use client";

import { useFieldArray, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton, RHFInput, RHFError, RHFController, Label, toast } from "@geckoui/geckoui";
import { Plus, Trash2 } from "lucide-react";
import { useRead, useWrite } from "@/lib/spoosh";
import TiptapEditor from "@/components/TiptapEditor";
import { aboutContentSchema, type AboutContentInput } from "@/validation/aboutContentSchema";
import { ABOUT_STATS, ABOUT_HERO_IMAGE, ABOUT_INTRO_IMAGE } from "@/app/about/constants";
import AdminPageHeader from "../../components/AdminPageHeader";

const DEFAULT_VALUES: AboutContentInput = {
  heroImage: ABOUT_HERO_IMAGE,
  introTagline: "Who We Are",
  introHeading: "About Us",
  introContent: "",
  introImage: ABOUT_INTRO_IMAGE,
  stats: ABOUT_STATS,
};

const MAX_STATS = 8;

export default function AdminAboutPage() {
  const { data, trigger: refetch } = useRead((api) =>
    api("admin/app-content").GET({ query: { key: "about" } }),
  );
  const { trigger: saveContent } = useWrite((api) => api("admin/app-content").PUT());

  const items = data?.items ?? [];

  const getValue = (type: string) => items.find((i) => i.type === type)?.value ?? "";

  let statsFromDb = DEFAULT_VALUES.stats;
  const rawStats = getValue("stats");

  if (rawStats) {
    try {
      const parsed = JSON.parse(rawStats);
      if (Array.isArray(parsed) && parsed.length > 0) statsFromDb = parsed;
    } catch {
      // fallback
    }
  }

  const methods = useForm<AboutContentInput>({
    values: items.length > 0
      ? {
          heroImage: getValue("heroImage") || ABOUT_HERO_IMAGE,
          introTagline: getValue("introTagline") || "Who We Are",
          introHeading: getValue("introHeading") || "About Us",
          introContent: getValue("introContent") || "",
          introImage: getValue("introImage") || ABOUT_INTRO_IMAGE,
          stats: statsFromDb,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(aboutContentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "stats",
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await Promise.all([
      saveContent({ body: { key: "about", type: "heroImage", value: values.heroImage } }),
      saveContent({ body: { key: "about", type: "introTagline", value: values.introTagline } }),
      saveContent({ body: { key: "about", type: "introHeading", value: values.introHeading } }),
      saveContent({ body: { key: "about", type: "introContent", value: values.introContent } }),
      saveContent({ body: { key: "about", type: "introImage", value: values.introImage } }),
      saveContent({ body: { key: "about", type: "stats", value: JSON.stringify(values.stats) } }),
    ]);

    await refetch();
    toast.success("About page saved.");
  });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="About Page"
        description="Manage content shown on the public About Us page."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Hero Section</h2>

            <div className="space-y-1.5">
              <Label>Hero Image URL</Label>
              <RHFInput name="heroImage" placeholder={ABOUT_HERO_IMAGE} />
              <RHFError name="heroImage" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Intro Section</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label required>Tagline</Label>
                <RHFInput name="introTagline" placeholder="Who We Are" />
                <RHFError name="introTagline" />
              </div>

              <div className="space-y-1.5">
                <Label required>Heading</Label>
                <RHFInput name="introHeading" placeholder="About Us" />
                <RHFError name="introHeading" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label required>Content</Label>
              <RHFController
                name="introContent"
                render={({ field, fieldState }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write about your company..."
                    hasError={!!fieldState.error}
                  />
                )}
              />
              <RHFError name="introContent" />
            </div>

            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <RHFInput name="introImage" placeholder={ABOUT_INTRO_IMAGE} />
              <RHFError name="introImage" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Stats</h2>
              {fields.length < MAX_STATS && (
                <button
                  type="button"
                  onClick={() => append({ value: "", label: "" })}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Stat
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                      <Label required>Value</Label>
                      <RHFInput name={`stats.${index}.value`} placeholder="180+" />
                      <RHFError name={`stats.${index}.value`} />
                    </div>
                    <div className="space-y-1">
                      <Label required>Label</Label>
                      <RHFInput name={`stats.${index}.label`} placeholder="Properties Sold & Leased" />
                      <RHFError name={`stats.${index}.label`} />
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              loading={methods.formState.isSubmitting}
              loadingText="Saving..."
              className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
