"use client";

import Image from "next/image";
import { Check, ExternalLink, Trash2 } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { formatBytes } from "@/utils/formatBytes";
import type { ClientMediaImage } from "@/types/media";

interface LibraryImageCardProps {
  image: ClientMediaImage;
  bulkMode: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onDelete: (image: ClientMediaImage) => void;
}

export default function LibraryImageCard({ image, bulkMode, isSelected, onToggle, onDelete }: LibraryImageCardProps) {
  return (
    <div
      className={classNames(
        "relative group aspect-square rounded-xl overflow-hidden border bg-gray-100 cursor-pointer",
        bulkMode && isSelected ? "border-primary-500 border-2" : "border-gray-200",
      )}
      onClick={bulkMode ? () => onToggle(image.id) : undefined}
    >
      <Image src={image.url} alt={image.filename} fill className="object-cover" unoptimized />

      {bulkMode && (
        <div
          className={classNames(
            "absolute inset-0 transition-colors",
            isSelected ? "bg-primary-500/20" : "bg-transparent hover:bg-black/10",
          )}
        />
      )}

      {bulkMode && (
        <div className="absolute top-2 left-2">
          <div
            className={classNames(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              isSelected
                ? "bg-primary-500 border-primary-500"
                : "bg-white/90 border-gray-300",
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
      )}

      {!bulkMode && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
          <div className="w-full px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
            <p className="text-[10px] text-gray-300">{formatBytes(image.size)}</p>
            <div className="flex items-center justify-between gap-1">
              <span className="text-white text-[10px] truncate flex-1">{image.filename}</span>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 bg-white rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image);
                  }}
                  className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
