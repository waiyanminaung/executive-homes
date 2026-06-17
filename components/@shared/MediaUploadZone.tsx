"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { form, type SpooshBody } from "@spoosh/core";
import { classNames } from "@/utils/classNames";
import { useQueue } from "@/lib/spoosh";
import type { ClientMediaImage } from "@/types/media";

interface MediaUploadZoneProps {
  onUploadStart?: (count: number) => void;
  onUploaded: (image: ClientMediaImage) => void;
}

type UploadInput = { id?: string; body: SpooshBody<{ file: File }> };

export default function MediaUploadZone({ onUploadStart, onUploaded }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { trigger: queueTrigger, stats } = useQueue((api) => api("admin/media").POST());

  const trigger = queueTrigger as (input: UploadInput) => ReturnType<typeof queueTrigger>;

  const uploading = stats.running > 0 || stats.pending > 0;

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    onUploadStart?.(fileArray.length);

    for (const file of fileArray) {
      trigger({ body: form({ file }) }).then((result) => {
        if (result.data) onUploaded(result.data);
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={classNames(
          "border-2 border-dashed rounded-xl py-14 px-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          isDragging ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Upload className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB · Converted to WebP</p>
        </div>
      </div>

      {uploading && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading {stats.settled} of {stats.total}...</span>
            <span>{stats.percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      )}

      {stats.failed > 0 && (
        <p className="text-sm text-red-600 text-center">
          {stats.failed} file{stats.failed > 1 ? "s" : ""} failed to upload.
        </p>
      )}
    </div>
  );
}
