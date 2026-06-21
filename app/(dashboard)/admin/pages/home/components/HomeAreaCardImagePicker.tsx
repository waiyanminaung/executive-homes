"use client";

import Image from "next/image";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { ClientMediaImage } from "@/types/media";

interface HomeAreaCardImagePickerProps {
  previewUrl: string | null;
  error: string | null;
  onSelect: (image: ClientMediaImage) => void;
}

export default function HomeAreaCardImagePicker({ previewUrl, error, onSelect }: HomeAreaCardImagePickerProps) {
  const handleOpen = () => {
    openMediaPicker({
      multiple: false,
      initialSelected: previewUrl ? [previewUrl] : [],
      onSelect: () => {},
      onSelectImages: (images) => {
        if (images[0]) onSelect(images[0]);
      },
    });
  };

  return (
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

        <button
          type="button"
          onClick={handleOpen}
          className="text-sm font-medium text-primary-700 hover:text-primary-800 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
        >
          {previewUrl ? "Change Image" : "Select Image"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
