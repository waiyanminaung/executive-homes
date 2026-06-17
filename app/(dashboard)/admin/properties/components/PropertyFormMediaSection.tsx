"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Images, Trash2 } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];

  const handleAddImages = () => {
    openMediaPicker({
      multiple: true,
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
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
