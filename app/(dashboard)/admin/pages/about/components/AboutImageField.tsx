"use client";

import { useState } from "react";
import { RHFController, RHFError, Label } from "@geckoui/geckoui";
import MediaImagePicker from "@/components/@shared/MediaImagePicker";
import type { ClientMediaImage } from "@/types/media";
import type { AboutContentInput } from "@/validation/aboutContentSchema";

interface AboutImageFieldProps {
  name: keyof Pick<AboutContentInput, "heroImage" | "introImage">;
  label: string;
  initialPreviewUrl: string | null;
}

export default function AboutImageField({ name, label, initialPreviewUrl }: AboutImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl);

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <RHFController
        name={name}
        render={({ field, fieldState }) => (
          <MediaImagePicker
            previewUrl={previewUrl}
            error={fieldState.error?.message ?? null}
            alt={label}
            onSelect={(image: ClientMediaImage) => {
              field.onChange(image.id);
              setPreviewUrl(image.url);
            }}
            onClear={() => {
              field.onChange("");
              setPreviewUrl(null);
            }}
          />
        )}
      />
      <RHFError name={name} />
    </div>
  );
}
