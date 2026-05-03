"use client";

import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import type { Category } from "@/types/content";
import {
  movieCreateSchema,
  type MovieCreateInput,
} from "@/validation/moviesSchema";

interface AdminCreateContentPanelProps {
  categories: Category[];
  onCreated: () => void;
  onCancel: () => void;
}

const defaultValues: MovieCreateInput = {
  title: "",
  type: "movie",
  year: new Date().getFullYear(),
  rating: 0,
  duration: "",
  genre: "",
  description: "",
  posterUrl: "",
  backdropUrl: "",
  telegramUrl: "",
  embedUrl: "",
  categoryIds: [],
  isTrending: false,
  isPopular: false,
};

export default function AdminCreateContentPanel({
  categories,
  onCreated,
  onCancel,
}: AdminCreateContentPanelProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const methods = useForm<MovieCreateInput>({
    resolver: zodResolver(
      movieCreateSchema,
    ) as unknown as Resolver<MovieCreateInput>,
    defaultValues,
  });
  const selectedCategoryIds = useWatch({
    control: methods.control,
    name: "categoryIds",
  });
  const { trigger, loading } = useWrite((api) => api("movies").POST());

  const handleSubmit = methods.handleSubmit(
    async (values: MovieCreateInput) => {
      setSubmitError(null);

      const result = await trigger({
        body: values,
      });

      if (!result.error) {
        methods.reset(defaultValues);
        onCreated();
        return;
      }

      setSubmitError(result.error.message);
    },
  );

  return (
    <section className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 lg:p-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                Create
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tighter text-white">
                Add New Content
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-white px-5 font-black uppercase tracking-[0.18em] text-black hover:bg-white/90"
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Title">
              <Input {...methods.register("title")} />
            </Field>
            <Field label="Type">
              <Input {...methods.register("type")} />
            </Field>
            <Field label="Year">
              <Input type="number" {...methods.register("year")} />
            </Field>
            <Field label="Rating">
              <Input type="number" step="0.1" {...methods.register("rating")} />
            </Field>
            <Field label="Duration">
              <Input {...methods.register("duration")} />
            </Field>
            <Field label="Genre">
              <Input {...methods.register("genre")} />
            </Field>
            <Field label="Poster URL">
              <Input {...methods.register("posterUrl")} />
            </Field>
            <Field label="Backdrop URL">
              <Input {...methods.register("backdropUrl")} />
            </Field>
            <Field label="Telegram URL">
              <Input {...methods.register("telegramUrl")} />
            </Field>
            <Field label="Embed URL">
              <Input {...methods.register("embedUrl")} />
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                Description
              </label>
              <Textarea rows={6} {...methods.register("description")} />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Categories
                </p>
                <div className="mt-3 grid gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  {categories.length === 0 ? (
                    <p className="text-sm text-white/30">
                      No categories available.
                    </p>
                  ) : (
                    categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(category.id)}
                          onChange={(event) => {
                            const current = methods.getValues("categoryIds");
                            if (event.target.checked) {
                              methods.setValue("categoryIds", [
                                ...current,
                                category.id,
                              ]);
                              return;
                            }

                            methods.setValue(
                              "categoryIds",
                              current.filter((value) => value !== category.id),
                            );
                          }}
                        />
                        <span className="text-sm text-white/70">
                          {category.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                  <input type="checkbox" {...methods.register("isTrending")} />
                  Trending
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                  <input type="checkbox" {...methods.register("isPopular")} />
                  Popular
                </label>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
        {label}
      </span>
      {children}
    </label>
  );
}
