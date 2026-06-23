"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, Images, X, Search, Upload as UploadIcon } from "lucide-react";
import { Button, Dialog, Input, Pagination } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useMediaLibrary } from "@/utils/useMediaLibrary";
import { collectDroppedFiles } from "@/utils/collectDroppedFiles";
import type { ClientMediaImage } from "@/types/media";
import MediaLibraryTab from "./MediaLibraryTab";
import MediaUploadZone from "./MediaUploadZone";

const PAGE_LIMIT = 30;

interface MediaPickerDialogProps {
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  onSelectImages?: (images: ClientMediaImage[]) => void;
  multiple?: boolean;
  initialSelected?: string[];
}

type Tab = "library" | "upload";

export function openMediaPicker(opts: {
  onSelect: (urls: string[]) => void;
  onSelectImages?: (images: ClientMediaImage[]) => void;
  multiple?: boolean;
  initialSelected?: string[];
}) {
  Dialog.show({
    className: "w-full max-w-3xl",
    content: ({ dismiss }) => (
      <MediaPickerDialog
        onClose={dismiss}
        onSelect={(urls) => {
          opts.onSelect(urls);
          dismiss();
        }}
        onSelectImages={opts.onSelectImages}
        multiple={opts.multiple}
        initialSelected={opts.initialSelected}
      />
    ),
  });
}

export default function MediaPickerDialog({
  onClose,
  onSelect,
  onSelectImages,
  multiple = true,
  initialSelected,
}: MediaPickerDialogProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected ?? []));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const handleUploaded = useCallback((image: ClientMediaImage) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(image.url);
      return next;
    });
  }, []);

  const { images, total, loading, items: uploadItems, handleFiles, retry, remove } = useMediaLibrary({
    onUploaded: handleUploaded,
    onStart: () => setTab("library"),
    search,
    page,
    limit: PAGE_LIMIT,
  });

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const toggle = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (!multiple) {
        next.clear();
        if (!prev.has(url)) next.add(url);
        return next;
      }

      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }

      return next;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    const files = await collectDroppedFiles(e.dataTransfer);
    if (files.length === 0) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    handleFiles(dt.files);
  };

  return (
    <div
      className="flex flex-col max-h-[85vh] relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-50 rounded-xl border-2 border-primary-400 bg-primary-50/90 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <UploadIcon className="w-10 h-10 text-primary-500" />
          <p className="text-sm font-semibold text-primary-700">Drop to upload</p>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Media Library</h2>
        <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 pb-0">
        {(["library", "upload"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={classNames(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t
                ? "border-primary-500 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {t === "library" ? <Images className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {t === "library" ? "Library" : "Upload"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className={tab === "library" ? "block" : "hidden"}>
          <div className="mb-4">
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
          <MediaLibraryTab
            images={images}
            loading={loading}
            selected={selected}
            onToggle={toggle}
            uploadItems={uploadItems}
            onRetry={retry}
            onDelete={remove}
          />
        </div>

        <div className={tab === "upload" ? "block" : "hidden"}>
          <MediaUploadZone onFiles={handleFiles} />
        </div>
      </div>

      {tab === "library" && totalPages > 1 && (
        <div className="flex justify-center px-5 py-3 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
            className="justify-center"
          />
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-white">
        <span className="text-sm text-gray-500">
          {selected.size > 0
            ? `${selected.size} image${selected.size > 1 ? "s" : ""} selected`
            : "None selected"}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selected.size === 0}
            onClick={() => {
              const selectedUrls = Array.from(selected);
              onSelect(selectedUrls);
              onSelectImages?.(images.filter((img) => selected.has(img.url)));
            }}
          >
            Add Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
