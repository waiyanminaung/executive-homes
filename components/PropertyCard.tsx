"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { PropertyItem } from "@/app/types";

interface PropertyCardProps {
  property: PropertyItem;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const images = property.imageUrls;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_4px_12px_rgb(17_24_39/0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[305/219] overflow-hidden" ref={emblaRef}>
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

        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-2xl bg-black/70 px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-[13px] font-semibold text-white">{property.status}</span>
        </span>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={classNames(
                  "h-2 w-2 rounded-md shadow transition-opacity",
                  i === selectedIndex ? "bg-white opacity-100" : "bg-white/60",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 p-[18px]">
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-2.5">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-neutral-950">
              {property.title}
            </h3>
            <p className="text-sm font-normal text-neutral-900">{property.location}</p>
          </div>

          <dl className="flex flex-wrap items-center gap-4 text-sm font-semibold text-neutral-900">
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
              <dd>{property.area}</dd>
            </div>
          </dl>
        </div>

        <p className="text-lg font-bold text-secondary-900">{property.price}</p>
      </div>
    </article>
  );
}
