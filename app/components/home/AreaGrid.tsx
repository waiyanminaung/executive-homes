"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { AreaCard } from "@/app/types";

interface AreaGridProps {
  areas: AreaCard[];
  title?: string;
}

function buildAreaHref(area: AreaCard): string {
  const params = new URLSearchParams();
  if (area.districtId) params.set("districtId", area.districtId);
  else if (area.provinceId) params.set("provinceId", area.provinceId);
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

function AreaCardItem({ area, tall }: { area: AreaCard; tall?: boolean }) {
  return (
    <Link
      href={buildAreaHref(area)}
      className={classNames(
        "group relative block min-h-[180px] flex-1 overflow-hidden rounded-xl shadow-sm",
        tall && "min-h-[372px]",
      )}
    >
      <Image
        src={area.imageUrl}
        alt={area.name}
        fill
        sizes="(min-width: 1024px) 25vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-bold">{area.name}</h3>
        <p className="text-sm font-normal">{area.listings} listings</p>
      </div>
    </Link>
  );
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

export function AreaGrid({ areas, title = "Explore Bangkok Areas" }: AreaGridProps) {
  const [featured, ...rest] = areas;
  const pairs = chunkArray(rest, 2);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("init", update);
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    update();

    return () => {
      emblaApi.off("init", update);
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="container mx-auto px-4 pb-12 pt-10 md:pb-16 md:pt-[120px]">
      <div className="mb-5 flex items-center justify-between md:mb-6">
        <h2 className="text-2xl font-bold text-neutral-950 md:text-[28px]">
          {title}
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous areas"
            onClick={() => emblaApi?.scrollPrev()}
            className={classNames(
              "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-all hover:border-neutral-500 hover:text-neutral-900",
              !canScrollPrev && "cursor-not-allowed opacity-40",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next areas"
            onClick={() => emblaApi?.scrollNext()}
            className={classNames(
              "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-all hover:border-neutral-500 hover:text-neutral-900",
              !canScrollNext && "cursor-not-allowed opacity-40",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {featured && (
            <div className="flex shrink-0 basis-[calc(50%-6px)] flex-col gap-3 lg:basis-[calc(25%-9px)]">
              <AreaCardItem area={featured} tall />
            </div>
          )}

          {pairs.map((pair, index) => (
            <div
              key={index}
              className="flex shrink-0 basis-[calc(50%-6px)] flex-col gap-3 lg:basis-[calc(25%-9px)]"
            >
              {pair.map((area) => (
                <AreaCardItem key={area.name} area={area} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
