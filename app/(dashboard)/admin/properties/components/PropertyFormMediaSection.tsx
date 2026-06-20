"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Images, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];

  const handleAddImages = () => {
    openMediaPicker({
      multiple: true,
      initialSelected: imageUrls,
      onSelect: (urls) => {
        const existing = new Set(imageUrls);
        const newUrls = urls.filter((u) => !existing.has(u));
        setValue("imageUrls", [...imageUrls, ...newUrls]);
      },
    });
  };

  const removeUrl = (index: number) => {
    setValue("imageUrls", imageUrls.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...imageUrls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setValue("imageUrls", next);
  };

  const moveDown = (index: number) => {
    if (index === imageUrls.length - 1) return;
    const next = [...imageUrls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setValue("imageUrls", next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Images</h2>
        <Button type="button" variant="outlined" size="sm" onClick={handleAddImages}>
          <Images className="w-4 h-4 mr-1.5" />
          Add Images
        </Button>
      </div>

      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                <div className="absolute top-1 left-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={classNames(
                      "p-1 bg-white rounded-full text-gray-600 hover:bg-gray-50 shadow-sm",
                      index === 0 ? "opacity-30 cursor-not-allowed" : "",
                    )}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === imageUrls.length - 1}
                    className={classNames(
                      "p-1 bg-white rounded-full text-gray-600 hover:bg-gray-50 shadow-sm",
                      index === imageUrls.length - 1 ? "opacity-30 cursor-not-allowed" : "",
                    )}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {index === 0 && (
                  <div className="absolute bottom-1 left-1">
                    <span className="text-[10px] font-medium bg-primary-600 text-white px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">No images added yet. Click &ldquo;Add Images&rdquo; to pick from the library.</p>
      )}
    </div>
  );
}
