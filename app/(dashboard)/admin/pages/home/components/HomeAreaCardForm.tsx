"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { form } from "@spoosh/core";
import {
  ConfirmDialog,
  RHFInput,
  RHFSelect,
  RHFError,
  SelectOption,
  RHFNumberInput,
} from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { homeAreaCardFormSchema, type HomeAreaCardFormValues } from "@/validation/homeAreaCardSchema";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import HomeAreaCardImagePicker from "./HomeAreaCardImagePicker";

const DEFAULT_VALUES: HomeAreaCardFormValues = {
  name: "",
  order: 0,
  provinceId: null,
  districtId: null,
};

interface HomeAreaCardFormProps {
  card: HomeAreaCard | null;
  onSaved: () => void;
  onCancel: () => void;
  onDeleted?: () => void;
}

export default function HomeAreaCardForm({ card, onSaved, onCancel, onDeleted }: HomeAreaCardFormProps) {
  const { data: provincesData } = useRead((api) => api("admin/provinces").GET());
  const provinces = provincesData?.provinces ?? [];

  const { trigger: uploadMedia } = useWrite((api) => api("admin/media").POST());
  const { trigger: createCard } = useWrite((api) => api("admin/home-area-cards").POST());
  const { trigger: updateCard } = useWrite((api) => api("admin/home-area-cards/:id").PATCH());
  const { trigger: deleteCard } = useWrite((api) => api("admin/home-area-cards/:id").DELETE());

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    card?.imageKey ? getMediaUrl(card.imageKey) : null,
  );

  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const methods = useForm<HomeAreaCardFormValues>({
    values: card
      ? {
          name: card.name,
          order: card.order,
          provinceId: card.provinceId,
          districtId: card.districtId,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(homeAreaCardFormSchema),
  });

  const provinceId = methods.watch("provinceId");

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const handleSubmit = methods.handleSubmit(async (values) => {
    setImageError(null);

    let imageKey = card?.imageKey ?? "";

    if (imageFile) {
      const uploaded = await uploadMedia({ body: form({ file: imageFile }) });

      if (!uploaded?.data?.key) {
        setImageError("Image upload failed. Try again.");
        return;
      }

      imageKey = uploaded.data.key;
    }

    if (!imageKey) {
      setImageError("Image is required.");
      return;
    }

    if (card) {
      await updateCard({ params: { id: card.id }, body: { ...values, imageKey } });
    } else {
      await createCard({ body: { ...values, imageKey } });
    }

    onSaved();
  });

  const handleDelete = () => {
    if (!card) return;

    ConfirmDialog.show({
      title: "Delete area card?",
      content: `"${card.name}" will be permanently removed from the home page.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteCard({ params: { id: card.id } });
        onDeleted?.();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="p-5 border-t border-gray-100 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <RHFInput name="name" placeholder="e.g. Sathorn" />
            <RHFError name="name" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <RHFNumberInput name="order" min={0} />
            <RHFError name="order" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <RHFSelect<string>
              name="provinceId"
              placeholder="Any province"
              onChange={() => methods.setValue("districtId", null)}
            >
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

          <HomeAreaCardImagePicker
            previewUrl={previewUrl}
            filename={imageFile?.name ?? null}
            error={imageError}
            onFileChange={(file) => { setImageFile(file); setImageError(null); }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {card ? (
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
              {methods.formState.isSubmitting ? "Saving..." : card ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
