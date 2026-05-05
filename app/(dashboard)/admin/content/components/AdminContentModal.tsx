"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Film, Save, Tv, X } from "lucide-react";
import { Button, LoadingButton } from "@geckoui/geckoui";
import { DEFAULT_ADMIN_CONTENT_VALUES } from "@/constants/adminContent";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category, Content } from "@/types/content";
import {
  movieCreateSchema,
  type MovieCreateInput,
} from "@/validation/moviesSchema";
import AdminContentFormFields from "./AdminContentFormFields";
import AdminTmdbImportPanel from "./AdminTmdbImportPanel";

interface AdminContentModalProps {
  categories: Category[];
  content?: Content;
  onClose: () => void;
}

const toFormValues = (content?: Content): MovieCreateInput => {
  if (!content) return DEFAULT_ADMIN_CONTENT_VALUES;

  return {
    title: content.title,
    type: content.type,
    year: content.year,
    rating: content.rating,
    duration: content.duration ?? "",
    genre: content.genre.join(", "),
    description: content.description,
    posterUrl: content.posterUrl,
    backdropUrl: content.backdropUrl,
    telegramUrl: content.telegramUrl ?? "",
    embedUrl: content.embedUrl ?? "",
    categoryIds: content.categoryIds,
    isTrending: !!content.isTrending,
    isPopular: !!content.isPopular,
  };
};

export default function AdminContentModal({
  categories,
  content,
  onClose,
}: AdminContentModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const methods = useForm<MovieCreateInput>({
    values: toFormValues(content),
    resolver: zodResolver(
      movieCreateSchema,
    ) as unknown as Resolver<MovieCreateInput>,
  });
  const createContent = useWrite((api) => api("movies").POST());
  const updateContent = useWrite((api) => api("movies/:id").PUT());
  const isEditing = !!content;
  const loading = createContent.loading || updateContent.loading;
  const contentType = useWatch({ control: methods.control, name: "type" });
  const Icon = contentType === "series" ? Tv : Film;

  const handleSubmit = methods.handleSubmit(async (values) => {
    setSubmitError(null);

    const result =
      isEditing && content
        ? await updateContent.trigger({
            params: { id: content.id },
            body: values,
          })
        : await createContent.trigger({ body: values });

    if (!result.error) {
      methods.reset(DEFAULT_ADMIN_CONTENT_VALUES);
      onClose();
      return;
    }

    setSubmitError(result.error.message);
  });

  return (
    <div
      className={classNames(
        "relative max-h-[90vh] overflow-y-auto rounded-3xl border border-white/5",
        "bg-[#111] p-6 text-white shadow-2xl shadow-[0_0_50px_rgba(229,9,20,0.1)]",
        "no-scrollbar lg:rounded-[3rem] lg:p-10",
      )}
    >
      <Button
        type="button"
        variant="icon"
        onClick={onClose}
        className={classNames(
          "absolute right-6 top-6 rounded-full p-3 text-white/30",
          "hover:bg-white/5 hover:text-white lg:right-8 lg:top-8",
        )}
      >
        <X className="size-5 lg:size-6" />
      </Button>

      <div className={classNames("mb-8 lg:mb-10")}>
        <div className={classNames("mb-3 flex items-center gap-3")}>
          <div
            className={classNames(
              "flex size-9 items-center justify-center rounded-xl bg-accent/20",
              "text-accent lg:size-10",
            )}
          >
            <Icon className="size-5" />
          </div>
          <span
            className={classNames(
              "truncate text-[10px] font-black uppercase tracking-[0.3em]",
              "text-white/30",
            )}
          >
            မာတိကာ စီမံခန့်ခွဲခြင်း
          </span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter lg:text-4xl">
          {isEditing ? "Edit Content" : "Add New Content"}
        </h2>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </div>
          ) : null}

          <AdminTmdbImportPanel />

          <AdminContentFormFields categories={categories} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="order-2 rounded-xl py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 sm:order-1 sm:flex-1"
            >
              မလုပ်တော့ပါ
            </Button>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={isEditing ? "Saving..." : "Creating..."}
              className="order-1 flex items-center justify-center gap-3 rounded-xl bg-white py-4 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] hover:bg-white/90 active:scale-95 sm:order-2 sm:flex-1"
            >
              <Save className="size-4" />
              {isEditing ? "Save Content" : "Create Content"}
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
