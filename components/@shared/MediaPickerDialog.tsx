"use client";

import { useState } from "react";
import { Upload, Images, X } from "lucide-react";
import { Button, Dialog } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { ClientMediaImage } from "@/types/media";
import MediaLibraryTab from "./MediaLibraryTab";
import MediaUploadTab from "./MediaUploadTab";

interface MediaPickerDialogProps {
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}

type Tab = "library" | "upload";

export function openMediaPicker(opts: {
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
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
        multiple={opts.multiple}
      />
    ),
  });
}

export default function MediaPickerDialog({
  onClose,
  onSelect,
  multiple = true,
}: MediaPickerDialogProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploadingCount, setUploadingCount] = useState(0);

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

  const handleUploadStart = (count: number) => {
    setUploadingCount(count);
    setTab("library");
  };

  const handleUploaded = (image: ClientMediaImage) => {
    setUploadingCount((n) => n - 1);
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(image.url);
      return next;
    });
  };

  return (
    <div className="flex flex-col max-h-[85vh]">
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
        {tab === "library" ? (
          <MediaLibraryTab selected={selected} onToggle={toggle} uploadingCount={uploadingCount} />
        ) : (
          <MediaUploadTab onUploaded={handleUploaded} onUploadStart={handleUploadStart} />
        )}
      </div>

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
          <Button type="button" disabled={selected.size === 0} onClick={() => onSelect(Array.from(selected))}>
            Add Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
