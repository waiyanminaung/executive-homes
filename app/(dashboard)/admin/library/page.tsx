"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ConfirmDialog, Pagination, Spinner } from "@geckoui/geckoui";
import { useWrite, optimistic } from "@/lib/spoosh";
import { formatBytes } from "@/utils/formatBytes";
import { useMediaLibrary } from "@/utils/useMediaLibrary";
import type { ClientMediaImage } from "@/types/media";
import MediaUploadZone from "@/components/@shared/MediaUploadZone";
import MediaUploadingCell from "@/components/@shared/MediaUploadingCell";
import LibraryImageCard from "./components/LibraryImageCard";
import LibraryToolbar from "./components/LibraryToolbar";

const PAGE_LIMIT = 30;

export default function LibraryPage() {
  const { trigger: deleteImage } = useWrite((api) => api("admin/media/:id").DELETE());
  const { trigger: bulkDeleteImages } = useWrite((api) => api("admin/media/bulk").DELETE());

  const [showUploadZone, setShowUploadZone] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const exitBulkMode = () => {
    setBulkMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      console.log("Selected URLs:", images.filter((img) => next.has(img.id)).map((img) => img.url));
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === images.length) {
      console.log("Selected URLs:", []);
      setSelectedIds(new Set());
    } else {
      console.log("Selected URLs:", images.map((img) => img.url));
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
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
        optimistic((cache) =>
          cache("admin/media").set((current) => ({
            ...current,
            images: (current?.images ?? []).filter((img) => img.id !== image.id),
            total: (current?.total ?? 1) - 1,
          })),
        );
      },
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;

    ConfirmDialog.show({
      title: `Delete ${count} image${count > 1 ? "s" : ""}`,
      content: (
        <p className="text-sm text-gray-600">
          {count} image{count > 1 ? "s" : ""} will be permanently deleted and cannot be recovered.
        </p>
      ),
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        const ids = Array.from(selectedIds);
        await bulkDeleteImages({ body: { ids } });
        optimistic((cache) =>
          cache("admin/media").set((current) => ({
            ...current,
            images: (current?.images ?? []).filter((img) => !ids.includes(img.id)),
            total: (current?.total ?? count) - count,
          })),
        );
        exitBulkMode();
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

        <LibraryToolbar
          bulkMode={bulkMode}
          selectedCount={selectedIds.size}
          totalImageCount={images.length}
          search={search}
          showUploadZone={showUploadZone}
          hasUploadItems={uploadItems.length > 0}
          onSearchChange={handleSearchChange}
          onSelectAll={handleSelectAll}
          onBulkDelete={handleBulkDelete}
          onExitBulkMode={exitBulkMode}
          onEnterBulkMode={() => setBulkMode(true)}
          onToggleUploadZone={() => setShowUploadZone((prev) => !prev)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {(images.length === 0 || showUploadZone) && !bulkMode && (
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
                <LibraryImageCard
                  key={img.id}
                  image={img}
                  bulkMode={bulkMode}
                  isSelected={selectedIds.has(img.id)}
                  onToggle={toggleSelect}
                  onDelete={handleDelete}
                />
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
