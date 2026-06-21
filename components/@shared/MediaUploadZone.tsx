"use client";

import { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Checkbox } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { MAX_UPLOAD_SIZE } from "@/validation/mediaSchema";

interface MediaUploadZoneProps {
  onFiles: (files: FileList | null, options?: { watermark?: boolean }) => void;
}

export default function MediaUploadZone({ onFiles }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [oversizedFiles, setOversizedFiles] = useState<string[]>([]);
  const [watermark, setWatermark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const oversized = files.filter((f) => f.size > MAX_UPLOAD_SIZE).map((f) => f.name);
    const valid = files.filter((f) => f.size <= MAX_UPLOAD_SIZE);

    setOversizedFiles(oversized);

    if (valid.length === 0) return;

    const dt = new DataTransfer();
    valid.forEach((f) => dt.items.add(f));
    onFiles(dt.files, { watermark });
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
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB per file · Converted to WebP</p>
        </div>
      </div>

      <div
        className="flex items-center gap-2 cursor-pointer w-fit rounded-lg bg-primary-50 border border-primary-700 px-3 py-2 hover:bg-primary-100 transition-colors"
        onClick={() => setWatermark((prev) => !prev)}
      >
        <Checkbox
          checked={watermark}
          onChange={(e) => setWatermark(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="!border-primary-700"
        />
        <span className="text-sm text-primary-700 select-none">Apply watermark</span>
      </div>

      {oversizedFiles.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs text-red-700">
            <span className="font-medium">Files too large (max 10MB):</span>{" "}
            {oversizedFiles.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}
