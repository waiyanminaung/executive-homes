"use client";

import Image from "next/image";
import { Check, ImageOff } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";

interface MediaLibraryTabProps {
  selected: Set<string>;
  onToggle: (url: string) => void;
  isUploading?: boolean;
}

export default function MediaLibraryTab({ selected, onToggle, isUploading = false }: MediaLibraryTabProps) {
  const { data, loading } = useRead((api) => api("admin/media").GET());
  const images = data?.images ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  if (images.length === 0 && !isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">No images uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {isUploading && (
        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent bg-gray-100 animate-pulse flex items-center justify-center">
          <Spinner className="w-5 h-5 text-gray-400" />
        </div>
      )}
      {images.map((img) => {
        const isSelected = selected.has(img.url);
        return (
          <button
            key={img.id}
            type="button"
            onClick={() => onToggle(img.url)}
            className={classNames(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
              isSelected ? "border-primary-500" : "border-transparent hover:border-gray-300",
            )}
          >
            <Image src={img.url} alt={img.filename} fill className="object-cover" unoptimized />
            {isSelected && (
              <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
