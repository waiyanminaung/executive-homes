"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConfirmDialog,
  RHFSelect,
  RHFError,
  SelectOption,
} from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { homeAreaCardFormSchema, type HomeAreaCardFormValues } from "@/validation/homeAreaCardSchema";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import type { ClientMediaImage } from "@/types/media";
import HomeAreaCardImagePicker from "./HomeAreaCardImagePicker";

const DEFAULT_VALUES: HomeAreaCardFormValues = {
  provinceId: null,
  districtId: null,
};

interface HomeAreaCardFormProps {
  card: HomeAreaCard | null;
  defaultOrder?: number;
  onSaved: () => void;
  onCancel: () => void;
  onDeleted?: () => void;
}

export default function HomeAreaCardForm({ card, defaultOrder = 0, onSaved, onCancel, onDeleted }: HomeAreaCardFormProps) {
  const { data: provincesData } = useRead((api) => api("admin/provinces").GET());
  const provinces = provincesData?.provinces ?? [];

  const { trigger: createCard } = useWrite((api) => api("admin/home-area-cards").POST());
  const { trigger: updateCard } = useWrite((api) => api("admin/home-area-cards/:id").PATCH());
  const { trigger: deleteCard } = useWrite((api) => api("admin/home-area-cards/:id").DELETE());

  const [imageKey, setImageKey] = useState<string>(card?.imageKey ?? "");
  const [imageError, setImageError] = useState<string | null>(null);

  const previewUrl = imageKey ? getMediaUrl(imageKey) : null;

  const methods = useForm<HomeAreaCardFormValues>({
    values: card
      ? {
          provinceId: card.provinceId,
          districtId: card.districtId,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(homeAreaCardFormSchema),
  });

  const provinceId = methods.watch("provinceId");
  const districtId = methods.watch("districtId");

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const deriveName = () => {
    if (districtId) return districts.find((d) => d.id === districtId)?.name ?? "";
    if (provinceId) return provinces.find((p) => p.id === provinceId)?.name ?? "";
    return "";
  };

  const handleSubmit = methods.handleSubmit(async (values) => {
    setImageError(null);

    if (!imageKey) {
      setImageError("Image is required.");
      return;
    }

    const name = deriveName();

    if (card) {
      await updateCard({ params: { id: card.id }, body: { ...values, name, imageKey } });
    } else {
      await createCard({ body: { ...values, name, imageKey, order: defaultOrder } });
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

  const handleImageSelect = (image: ClientMediaImage) => {
    setImageKey(image.key);
    setImageError(null);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="p-5 border-t border-gray-100 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <RHFSelect<string>
              name="provinceId"
              placeholder="Any province"
              clearable
              onChange={(v) => {
                if (v === undefined) methods.setValue("provinceId", null);
                methods.setValue("districtId", null);
              }}
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
              <RHFSelect<string>
                name="districtId"
                placeholder="Any district"
                clearable
                onChange={(v) => { if (v === undefined) methods.setValue("districtId", null); }}
              >
                {districts.map((d) => (
                  <SelectOption key={d.id} value={d.id} label={d.name} />
                ))}
              </RHFSelect>
              <RHFError name="districtId" />
            </div>
          )}

          <HomeAreaCardImagePicker
            previewUrl={previewUrl}
            error={imageError}
            onSelect={handleImageSelect}
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
