"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface PropertyGalleryModalProps {
  images: string[];
  open: boolean;
  title: string;
  initialIndex?: number;
  onClose: () => void;
}

export function PropertyGalleryModal({ images, open, title, initialIndex = 0, onClose }: PropertyGalleryModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!open) return;
    emblaApi?.scrollTo(initialIndex, true);
  }, [open, initialIndex, emblaApi]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const goPrev = () => emblaApi?.scrollPrev();
  const goNext = () => emblaApi?.scrollNext();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-secondary-950/95 text-white">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between gap-4 border-b border-white/10 px-4 md:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold md:text-base">{title}</p>
            <p className="text-xs text-white/60">{selectedIndex + 1} of {images.length}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            aria-label="Close gallery"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 p-0 !text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div key={image} className="relative h-full min-w-0 flex-[0_0_100%]">
                <Image
                  src={image}
                  alt={`${title} image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain p-4 md:p-8"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            aria-label="Previous image"
            onClick={goPrev}
            className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 p-0 !text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            aria-label="Next image"
            onClick={goNext}
            className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 p-0 !text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="border-t border-white/10 px-4 py-3 md:px-8">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={classNames(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-opacity md:h-20 md:w-32",
                  index === selectedIndex ? "border-primary-500 opacity-100" : "border-white/20 opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
