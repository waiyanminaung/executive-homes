"use client";

import Image from "next/image";
import { useState } from "react";
import { Images } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { PropertyGalleryModal } from "./PropertyGalleryModal";

interface PropertyDetailGalleryProps {
  images: string[];
  title: string;
}

export function PropertyDetailGallery({ images, title }: PropertyDetailGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [primaryImage, ...secondaryImages] = images;
  const visibleSecondaryImages = secondaryImages.slice(0, 4);
  const extraImageCount = Math.max(images.length - 4, 0);

  function openAt(index: number) {
    setInitialIndex(index);
    setGalleryOpen(true);
  }

  return (
    <section className="grid gap-1.5 overflow-hidden rounded-[10px] md:grid-cols-[1fr_1.06fr]">
      <button
        type="button"
        onClick={() => openAt(0)}
        className="relative min-h-[300px] overflow-hidden bg-neutral-200 md:min-h-[440px]"
      >
        <Image
          src={primaryImage}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 624px, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </button>

      <div className="relative grid min-h-[260px] grid-cols-2 gap-1.5 md:min-h-[440px]">
        {visibleSecondaryImages.map((image, index) => {
          const showOverlay = index === visibleSecondaryImages.length - 1;

          return (
            <button
              key={image}
              type="button"
              onClick={() => openAt(index + 1)}
              className="relative min-h-[128px] overflow-hidden bg-neutral-200"
            >
              <Image
                src={image}
                alt={`${title} gallery ${index + 2}`}
                fill
                sizes="(min-width: 1024px) 328px, 50vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />

              {showOverlay ? (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary-900/55 text-4xl font-bold text-white">
                  {extraImageCount}+
                </div>
              ) : null}
            </button>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          onClick={() => openAt(0)}
          className="absolute bottom-4 right-4 hidden h-10 rounded-md bg-neutral-950/80 px-3.5 text-sm font-semibold !text-white shadow-[0_8px_30px_rgb(0_0_0/0.16)] hover:bg-neutral-950/90 md:inline-flex"
        >
          <Images className="h-5 w-5" />
          <span>View All</span>
        </Button>
      </div>

      <PropertyGalleryModal
        images={images}
        open={galleryOpen}
        title={title}
        initialIndex={initialIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </section>
  );
}
