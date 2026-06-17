"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Button, ConfirmDialog, Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { ClientMediaImage } from "@/types/media";

interface UploadZoneProps {
  onUploadStart: () => void;
  onUploaded: () => void;
}

function UploadZone({ onUploadStart, onUploaded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setError(null);
    onUploadStart();

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={classNames(
          "border-2 border-dashed rounded-xl py-14 px-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          isDragging ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
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
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop image here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB · Converted to WebP</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}

export default function LibraryPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/media").GET());
  const { trigger: deleteImage } = useWrite((api) => api("admin/media/:id").DELETE());
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);

  const images = data?.images ?? [];
  const hasImages = images.length > 0 || isUploading;

  const handleUploadStart = () => {
    setIsUploading(true);
    setShowUploadZone(false);
  };

  const handleUploaded = () => {
    setIsUploading(false);
    refetch();
  };

  const handleDelete = (image: ClientMediaImage) => {
    ConfirmDialog.show({
      title: "Delete image",
      content: `Delete "${image.filename}"? This cannot be undone.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteImage({ params: { id: image.id } });
        refetch();
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </p>
        </div>

        {hasImages && !showUploadZone && (
          <Button type="button" variant="outlined" onClick={() => setShowUploadZone(true)}>
            Upload Image
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {(!hasImages || showUploadZone) && (
            <UploadZone onUploadStart={handleUploadStart} onUploaded={handleUploaded} />
          )}

          {hasImages && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {isUploading && (
                <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 animate-pulse flex items-center justify-center">
                  <Spinner className="w-6 h-6 text-gray-400" />
                </div>
              )}

              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <Image src={img.url} alt={img.filename} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end">
                    <div className="w-full px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                      <span className="text-white text-[10px] truncate flex-1 mr-2">{img.filename}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(img)}
                        className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
