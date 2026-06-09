"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { PropertyShareModal } from "./PropertyShareModal";

interface PropertyShareButtonProps {
  title: string;
}

export function PropertyShareButton({ title }: PropertyShareButtonProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        aria-label="Share property"
        onClick={() => setShareOpen(true)}
        className="h-[45px] w-[45px] rounded-full border-gray-200 bg-white p-0 text-neutral-900 shadow-detail-card"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <PropertyShareModal
        open={shareOpen}
        title={title}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
