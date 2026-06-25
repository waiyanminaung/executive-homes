"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { PropertyShareModal } from "./PropertyShareModal";

interface PropertyShareButtonProps {
  title: string;
}

export function PropertyShareButton({ title }: PropertyShareButtonProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Share property"
        onClick={() => setShareOpen(true)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-500"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <PropertyShareModal
        open={shareOpen}
        title={title}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
