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

interface GalleryImageProps {
  src: string;
  alt: string;
  sizes: string;
  onClick: () => void;
  overlay?: React.ReactNode;
}

function GalleryImage({ src, alt, sizes, onClick, overlay }: GalleryImageProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-0 overflow-hidden bg-neutral-200"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
      {overlay}
    </button>
  );
}

interface LayoutProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

function GalleryLayoutFour({ images, title, onImageClick }: LayoutProps) {
  const [primary, ...secondary] = images;

  return (
    <section className="grid gap-1.5 overflow-hidden rounded-[10px] md:grid-cols-2">
      <div className="relative min-h-[300px] md:min-h-[440px]">
        <GalleryImage
          src={primary}
          alt={title}
          sizes="(min-width: 768px) 50vw, 100vw"
          onClick={() => onImageClick(0)}
        />
      </div>
      <div className="grid gap-1.5">
        <div className="relative min-h-[214px]">
          <GalleryImage
            src={secondary[0]}
            alt={`${title} gallery 2`}
            sizes="(min-width: 768px) 50vw, 100vw"
            onClick={() => onImageClick(1)}
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {secondary.slice(1).map((image, index) => (
            <div key={image} className="relative min-h-[100px]">
              <GalleryImage
                src={image}
                alt={`${title} gallery ${index + 3}`}
                sizes="(min-width: 768px) 25vw, 50vw"
                onClick={() => onImageClick(index + 2)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryLayoutFivePlus({ images, title, onImageClick }: LayoutProps) {
  const [primary, ...secondary] = images;
  const extraImageCount = Math.max(images.length - 5, 0);

  return (
    <section className="grid gap-1.5 overflow-hidden rounded-[10px] md:grid-cols-[1fr_1.06fr]">
      <button
        type="button"
        onClick={() => onImageClick(0)}
        className="relative min-h-[300px] overflow-hidden bg-neutral-200 md:min-h-[440px]"
      >
        <Image
          src={primary}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 624px, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </button>

      <div className="relative grid min-h-[260px] grid-cols-2 gap-1.5 md:min-h-[440px]">
        {secondary.slice(0, 4).map((image, index) => {
          const isLast = index === 3;

          return (
            <div key={image} className="relative min-h-[128px] overflow-hidden bg-neutral-200">
              <GalleryImage
                src={image}
                alt={`${title} gallery ${index + 2}`}
                sizes="(min-width: 1024px) 328px, 50vw"
                onClick={() => onImageClick(index + 1)}
                overlay={
                  isLast && extraImageCount > 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary-900/55 text-4xl font-bold text-white">
                      {extraImageCount}+
                    </div>
                  ) : undefined
                }
              />
            </div>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          onClick={() => onImageClick(0)}
          className="absolute bottom-4 right-4 hidden h-10 rounded-md bg-neutral-950/80 px-3.5 text-sm font-semibold !text-white shadow-[0_8px_30px_rgb(0_0_0/0.16)] hover:bg-neutral-950/90 md:inline-flex"
        >
          <Images className="h-5 w-5" />
          <span>View All</span>
        </Button>
      </div>
    </section>
  );
}

export function PropertyDetailGallery({ images, title }: PropertyDetailGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/property-placeholder.png"];
  const [primaryImage, ...secondaryImages] = displayImages;

  function openAt(index: number) {
    setInitialIndex(index);
    setGalleryOpen(true);
  }

  return (
    <>
      {displayImages.length === 1 && (
        <section className="relative min-h-[400px] overflow-hidden rounded-[10px] md:min-h-[500px]">
          <GalleryImage
            src={primaryImage}
            alt={title}
            sizes="100vw"
            onClick={() => openAt(0)}
          />
        </section>
      )}

      {displayImages.length === 2 && (
        <section className="grid gap-1.5 overflow-hidden rounded-[10px] md:grid-cols-2">
          <div className="relative min-h-[300px] md:min-h-[440px]">
            <GalleryImage
              src={primaryImage}
              alt={title}
              sizes="(min-width: 768px) 50vw, 100vw"
              onClick={() => openAt(0)}
            />
          </div>
          <div className="relative min-h-[300px] md:min-h-[440px]">
            <GalleryImage
              src={secondaryImages[0]}
              alt={`${title} gallery 2`}
              sizes="(min-width: 768px) 50vw, 100vw"
              onClick={() => openAt(1)}
            />
          </div>
        </section>
      )}

      {displayImages.length === 3 && (
        <section className="grid gap-1.5 overflow-hidden rounded-[10px] md:grid-cols-2">
          <div className="relative min-h-[300px] md:min-h-[440px]">
            <GalleryImage
              src={primaryImage}
              alt={title}
              sizes="(min-width: 768px) 50vw, 100vw"
              onClick={() => openAt(0)}
            />
          </div>
          <div className="grid gap-1.5">
            {secondaryImages.map((image, index) => (
              <div key={image} className="relative min-h-[214px]">
                <GalleryImage
                  src={image}
                  alt={`${title} gallery ${index + 2}`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  onClick={() => openAt(index + 1)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {displayImages.length === 4 && (
        <GalleryLayoutFour images={displayImages} title={title} onImageClick={openAt} />
      )}

      {displayImages.length >= 5 && (
        <GalleryLayoutFivePlus images={displayImages} title={title} onImageClick={openAt} />
      )}

      <PropertyGalleryModal
        images={displayImages}
        open={galleryOpen}
        title={title}
        initialIndex={initialIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}
