"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { form, type SpooshBody } from "@spoosh/core";
import { classNames } from "@/utils/classNames";
import { useQueue } from "@/lib/spoosh";
import type { ClientMediaImage } from "@/types/media";

export type UploadFileItem = {
  id: string;
  filename: string;
  progress: number;
  status: "uploading" | "error";
  errorMessage?: string;
  file: File;
};

interface MediaUploadZoneProps {
  onUploadStart?: (count: number) => void;
  onUploaded: (image: ClientMediaImage) => void;
  onItemsChange?: (items: UploadFileItem[]) => void;
  retryRef?: React.MutableRefObject<((id: string) => void) | null>;
  removeRef?: React.MutableRefObject<((id: string) => void) | null>;
}

type UploadInput = { id?: string; body: SpooshBody<{ file: File }> };

function extractErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "error" in error) {
    return String((error as { error: unknown }).error);
  }
  return undefined;
}

export default function MediaUploadZone({ onUploadStart, onUploaded, onItemsChange, retryRef, removeRef }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const uploadItemsRef = useRef<UploadFileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { trigger: queueTrigger } = useQueue((api) => api("admin/media").POST());
  const trigger = queueTrigger as (input: UploadInput) => ReturnType<typeof queueTrigger>;

  const applyUpdate = (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => {
    const next = updater(uploadItemsRef.current);
    uploadItemsRef.current = next;
    onItemsChange?.(next);
  };

  const updateItem = (id: string, patch: Partial<UploadFileItem>) => {
    applyUpdate((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    applyUpdate((prev) => prev.filter((i) => i.id !== id));
  };

  const retryItem = (id: string) => {
    const item = uploadItemsRef.current.find((i) => i.id === id);
    if (!item) return;

    updateItem(id, { status: "uploading", progress: 0, errorMessage: undefined });

    trigger({ id, body: form({ file: item.file }) })
      .then((result) => {
        if (result.data) {
          applyUpdate((prev) => prev.filter((i) => i.id !== id));
          onUploaded(result.data);
        } else {
          updateItem(id, { status: "error", errorMessage: extractErrorMessage(result.error) });
        }
      })
      .catch(() => {
        updateItem(id, { status: "error" });
      });
  };

  useEffect(() => {
    if (retryRef) retryRef.current = retryItem;
    if (removeRef) removeRef.current = removeItem;
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    onUploadStart?.(fileArray.length);

    const newItems: UploadFileItem[] = fileArray.map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      filename: file.name,
      progress: 0,
      status: "uploading",
      file,
    }));

    applyUpdate((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      trigger({ id: item.id, body: form({ file: item.file }) })
        .then((result) => {
          if (result.data) {
            applyUpdate((prev) => prev.filter((i) => i.id !== item.id));
            onUploaded(result.data);
          } else {
            updateItem(item.id, { status: "error", errorMessage: extractErrorMessage(result.error) });
          }
        })
        .catch(() => {
          updateItem(item.id, { status: "error" });
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
    </div>
  );
}
