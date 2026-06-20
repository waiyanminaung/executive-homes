"use client";

import type { ClientMediaImage } from "@/types/media";
import type { UploadFileItem } from "./MediaUploadZone";
import MediaUploadZone from "./MediaUploadZone";

interface MediaUploadTabProps {
  onUploaded: (image: ClientMediaImage) => void;
  onUploadStart?: (count: number) => void;
  onItemsChange?: (items: UploadFileItem[]) => void;
  retryRef?: React.MutableRefObject<((id: string) => void) | null>;
  removeRef?: React.MutableRefObject<((id: string) => void) | null>;
}

export default function MediaUploadTab({ onUploaded, onUploadStart, onItemsChange, retryRef, removeRef }: MediaUploadTabProps) {
  return (
    <MediaUploadZone
      onUploaded={onUploaded}
      onUploadStart={onUploadStart}
      onItemsChange={onItemsChange}
      retryRef={retryRef}
      removeRef={removeRef}
    />
  );
}
