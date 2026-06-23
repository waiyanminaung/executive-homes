"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Trash2, ExternalLink, Search, X } from "lucide-react";
import { Button, ConfirmDialog, Input, Pagination, Spinner } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { formatBytes } from "@/utils/formatBytes";
import { useMediaLibrary } from "@/utils/useMediaLibrary";
import type { ClientMediaImage } from "@/types/media";
import MediaUploadZone from "@/components/@shared/MediaUploadZone";
import MediaUploadingCell from "@/components/@shared/MediaUploadingCell";

const PAGE_LIMIT = 30;

export default function LibraryPage() {
  const { trigger: deleteImage } = useWrite((api) => api("admin/media/:id").DELETE());
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleStart = useCallback(() => setShowUploadZone(false), []);

  const { images, total, loading, items: uploadItems, handleFiles, retry, remove } = useMediaLibrary({
    onStart: handleStart,
    search,
    page,
    limit: PAGE_LIMIT,
  });

  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const hasImages = images.length > 0 || uploadItems.length > 0;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDelete = (image: ClientMediaImage) => {
    ConfirmDialog.show({
      title: "Delete image",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            This image will be permanently deleted and cannot be recovered.
          </p>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Image
              src={image.url}
              alt={image.filename}
              width={48}
              height={48}
              className="w-12 h-12 rounded-md object-cover shrink-0 bg-gray-200"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{image.filename}</p>
              <p className="text-xs text-gray-500">{formatBytes(image.size)}</p>
            </div>
          </div>
        </div>
      ),
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteImage({ params: { id: image.id } });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} image{total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by filename..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              suffix={search ? (
                <button type="button" onClick={() => handleSearchChange("")}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              ) : undefined}
            />
          </div>

          {uploadItems.length === 0 && (
            <Button type="button" variant="outlined" onClick={() => setShowUploadZone((prev) => !prev)}>
              {showUploadZone ? "Close" : "Upload Images"}
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {(images.length === 0 || showUploadZone) && (
            <MediaUploadZone onFiles={handleFiles} />
          )}

          {hasImages && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {uploadItems.map((item) => (
                <MediaUploadingCell
                  key={item.id}
                  className="rounded-xl border border-gray-200"
                  filename={item.filename}
                  progress={item.progress}
                  status={item.status}
                  errorMessage={item.errorMessage}
                  onRetry={() => retry(item.id)}
                  onDelete={() => remove(item.id)}
                />
              ))}

              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <Image src={img.url} alt={img.filename} fill className="object-cover" unoptimized />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                    <div className="w-full px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
                      <p className="text-[10px] text-gray-300">{formatBytes(img.size)}</p>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-white text-[10px] truncate flex-1">{img.filename}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 bg-white rounded-full text-gray-600 hover:bg-gray-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDelete(img)}
                            className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={setPage}
                className="justify-center"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
