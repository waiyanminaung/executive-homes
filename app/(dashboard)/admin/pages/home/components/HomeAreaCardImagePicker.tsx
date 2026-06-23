"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { ClientMediaImage } from "@/types/media";

interface HomeAreaCardImagePickerProps {
  previewUrl: string | null;
  error: string | null;
  onSelect: (image: ClientMediaImage) => void;
  onClear: () => void;
}

export default function HomeAreaCardImagePicker({ previewUrl, error, onSelect, onClear }: HomeAreaCardImagePickerProps) {
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
    <div className="space-y-1.5 w-36 shrink-0">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group">
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Area preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleOpen}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Change image"
            />
          </>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            className={classNames(
              "absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2 transition-colors",
              error ? "text-red-400 hover:text-red-500" : "text-gray-400 hover:text-gray-500",
            )}
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-xs font-medium">Select image</span>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
