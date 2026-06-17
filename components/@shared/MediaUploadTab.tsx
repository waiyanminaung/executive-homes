"use client";

import type { ClientMediaImage } from "@/types/media";
import MediaUploadZone from "./MediaUploadZone";

interface MediaUploadTabProps {
  onUploaded: (image: ClientMediaImage) => void;
  onUploadStart?: (count: number) => void;
}

export default function MediaUploadTab({ onUploaded, onUploadStart }: MediaUploadTabProps) {
  return <MediaUploadZone onUploaded={onUploaded} onUploadStart={onUploadStart} />;
}
