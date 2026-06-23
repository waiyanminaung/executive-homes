"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Bath, BedDouble, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { formatArea } from "@/utils/formatArea";
import { formatPrice } from "@/utils/formatPrice";
import type { PropertyItem } from "@/app/types";

interface PropertyCardProps {
  property: PropertyItem;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const images = property.imageUrls.slice(0, 5);
  const propertyHref = `/properties/${property.slug}`;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handlePrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    emblaApi?.scrollPrev();
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    emblaApi?.scrollNext();
  };

  const handleDotClick = (event: MouseEvent<HTMLButtonElement>, imageIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    emblaApi?.scrollTo(imageIndex);
  };

  return (
    <Link
      href={propertyHref}
      aria-label={property.title}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_12px_rgb(17_24_39/0.08)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[305/219] overflow-hidden">
        <div className="h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => (
              <div key={i} className="relative h-full flex-[0_0_100%]">
                <Image
                  src={src}
                  alt={property.title}
                  fill
                  sizes="(min-width: 1280px) 305px, (min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-2xl bg-black/70 px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-[13px] font-semibold text-white">{property.listingType}</span>
        </span>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 p-1">
            <button
              type="button"
              aria-label="Previous image"
              onClick={handlePrev}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Image ${i + 1}`}
                  onClick={(event) => handleDotClick(event, i)}
                  className={classNames(
                    "h-1.5 w-1.5 cursor-pointer rounded-full transition-opacity",
                    i === selectedIndex ? "bg-white opacity-100" : "bg-white/60",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next image"
              onClick={handleNext}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:gap-5 md:p-[18px]">
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-2.5">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-neutral-950">
              {property.title}
            </h3>
            <p className="text-sm font-normal text-neutral-900">{property.location}</p>
          </div>

          <dl className="flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-900 md:gap-4">
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-[18px] w-[18px]" />
              <dt className="sr-only">Bedrooms</dt>
              <dd>{property.beds}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-[18px] w-[18px]" />
              <dt className="sr-only">Bathrooms</dt>
              <dd>{property.baths}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-[18px] w-[18px]" />
              <dt className="sr-only">Area</dt>
              <dd>{formatArea(property.area)}</dd>
            </div>
          </dl>
        </div>

        <p className="text-base font-bold text-primary-500 md:text-lg">
          {property.hasMultipleTiers ? "Starting from " : ""}
          {formatPrice(property.price)}{property.listingType === "Rent" || property.listingType === "Sale & Rent" ? "/mo" : ""}
        </p>
      </div>
    </Link>
  );
}
