"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { PropertyCard } from "@/components/PropertyCard";
import type { PropertySection as PropertySectionType } from "@/app/types";

interface PropertySectionProps {
  section: PropertySectionType;
}

export function PropertySection({ section }: PropertySectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between gap-4 md:mb-7">
        <h2 className="text-2xl font-bold text-neutral-950 md:text-[28px]">
          {section.title}
        </h2>
        <Link
          href="/properties"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-500"
        >
          <span>View More</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className={classNames(
            "absolute -left-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2",
            "items-center justify-center rounded-xl bg-white",
            "shadow-[0_8px_18px_rgb(0_0_0/0.2)] transition-all md:flex hover:scale-110 hover:bg-primary-500 hover:text-white hover:shadow-[0_8px_24px_rgb(174_137_76/0.4)]",
            !canPrev && "invisible",
          )}
        >
          <ChevronLeft className="h-5 w-5 text-neutral-700" />
        </button>

        <div className="-mx-3 -mt-2 -mb-4">
          <div className="overflow-hidden px-3 pt-2 pb-4" ref={emblaRef}>
            <div className="-ml-4 flex md:-ml-5">
              {section.properties.map((property) => (
                <div
                  key={property.id}
                  className="min-w-0 flex-[0_0_88%] self-stretch pl-4 sm:flex-[0_0_48%] md:flex-[0_0_33.333%] md:pl-5 lg:flex-[0_0_25%]"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className={classNames(
            "absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2",
            "items-center justify-center rounded-xl bg-white",
            "shadow-[0_8px_18px_rgb(0_0_0/0.2)] transition-all md:flex hover:scale-110 hover:bg-primary-500 hover:text-white hover:shadow-[0_8px_24px_rgb(174_137_76/0.4)]",
            !canNext && "invisible",
          )}
        >
          <ChevronRight className="h-5 w-5 text-neutral-700" />
        </button>
      </div>
    </section>
  );
}
