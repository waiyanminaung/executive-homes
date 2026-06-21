"use client";

import { useRef } from "react";
import Image from "next/image";

interface HomeAreaCardImagePickerProps {
  previewUrl: string | null;
  filename: string | null;
  error: string | null;
  isEditing: boolean;
  onFileChange: (file: File) => void;
}

export default function HomeAreaCardImagePicker({
  previewUrl,
  filename,
  error,
  isEditing,
  onFileChange,
}: HomeAreaCardImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-medium text-primary-700 hover:text-primary-800 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
          >
            {isEditing ? "Change Image" : "Select Image"}
          </button>

          {filename && (
            <p className="text-xs text-gray-500 mt-1">{filename}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
