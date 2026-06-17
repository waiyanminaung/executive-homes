"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { ConfirmDialog, Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { ClientMediaImage } from "@/types/media";

function UploadButton({ onUploaded }: { onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      await fetch("/api/admin/media", { method: "POST", body: formData });
      onUploaded();
    } finally {
      setUploading(false);
    }
  };

  return (
    <label
      className={classNames(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer",
        uploading ? "opacity-50 pointer-events-none" : "",
      )}
    >
      {uploading ? <Spinner className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
      {uploading ? "Uploading..." : "Upload Image"}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
    </label>
  );
}

export default function LibraryPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/media").GET());
  const { trigger: deleteImage } = useWrite((api) => api("admin/media/:id").DELETE());

  const images = data?.images ?? [];

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
        <UploadButton onUploaded={refetch} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-primary-600" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <ImageOff className="w-12 h-12" />
          <p className="text-sm">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
  );
}
