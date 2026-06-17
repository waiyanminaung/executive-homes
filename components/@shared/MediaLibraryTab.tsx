"use client";

import Image from "next/image";
import { Check, ImageOff, ExternalLink } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import { formatBytes } from "@/utils/formatBytes";
import MediaUploadingCell from "./MediaUploadingCell";

interface MediaLibraryTabProps {
  selected: Set<string>;
  onToggle: (url: string) => void;
  uploadingCount?: number;
}

export default function MediaLibraryTab({ selected, onToggle, uploadingCount = 0 }: MediaLibraryTabProps) {
  const { data, loading } = useRead((api) => api("admin/media").GET());
  const images = data?.images ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  if (images.length === 0 && uploadingCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">No images uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {Array.from({ length: uploadingCount }).map((_, i) => (
        <MediaUploadingCell key={i} />
      ))}

      {images.map((img) => {
        const isSelected = selected.has(img.url);

        return (
          <div key={img.id} className="relative group">
            <button
              type="button"
              onClick={() => onToggle(img.url)}
              className={classNames(
                "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
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

            <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity space-y-0.5 pointer-events-none">
              <p className="text-[9px] text-white drop-shadow font-medium leading-tight">{formatBytes(img.size)}</p>
            </div>

            <a
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        );
      })}
    </div>
  );
}
