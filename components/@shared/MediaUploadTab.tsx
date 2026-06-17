"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import type { ClientMediaImage } from "@/types/media";

interface MediaUploadTabProps {
  onUploaded: (image: ClientMediaImage) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function MediaUploadTab({ onUploaded, onUploadingChange }: MediaUploadTabProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const upload = async (file: File) => {
    setUploadingState(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }
      const image: ClientMediaImage = await res.json();
      onUploaded(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingState(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    upload(files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl py-16 px-8 transition-colors cursor-pointer hover:border-gray-300 border-gray-200"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <Spinner className="w-8 h-8 text-primary-600" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Click to browse or drop an image</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
