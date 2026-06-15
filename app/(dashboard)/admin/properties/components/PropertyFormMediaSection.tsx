"use client";

import { useState } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@geckoui/geckoui";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];
  const [inputValue, setInputValue] = useState("");

  const addUrl = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setValue("imageUrls", [...imageUrls, trimmed]);
    setInputValue("");
  };

  const removeUrl = (index: number) => {
    setValue("imageUrls", imageUrls.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUrl();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Images</h2>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste image URL and press Enter..."
          className="flex-1"
        />
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add
        </button>
      </div>

      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {url}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">No images added yet.</p>
      )}
    </div>
  );
}
