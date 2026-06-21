"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : card?.imageKey
      ? getMediaUrl(card.imageKey)
      : null;

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

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Area Image</label>

            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] ?? null);
                    setImageError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-primary-700 hover:text-primary-800 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  {card ? "Change Image" : "Select Image"}
                </button>

                {imageFile && (
                  <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>
                )}
              </div>
            </div>

            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          </div>
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
