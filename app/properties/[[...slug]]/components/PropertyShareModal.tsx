"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, X } from "lucide-react";
import { Button } from "@geckoui/geckoui";

interface PropertyShareModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function PropertyShareModal({ open, title, onClose }: PropertyShareModalProps) {
  const [pageUrl] = useState(() => (typeof window === "undefined" ? "" : window.location.href));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary-950/60 px-4">
      <button
        type="button"
        aria-label="Close share modal"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-detail-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-950">Share property</h2>
            <p className="mt-1 text-sm text-neutral-500">{title}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            aria-label="Close"
            onClick={onClose}
            className="h-9 w-9 rounded-full p-0 text-neutral-700 hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-2">
          <p className="min-w-0 flex-1 truncate text-sm text-neutral-700">{pageUrl}</p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCopy}
            className="h-9 rounded-md px-3 text-sm font-medium text-neutral-950 hover:bg-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-neutral-950 hover:bg-gray-50"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-neutral-950 hover:bg-gray-50"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-neutral-950 hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
