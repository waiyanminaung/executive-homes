"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { classNames } from "@/utils/classNames";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { HomePetToggle } from "./HomePetToggle";
import { HomeSearchInput } from "./HomeSearchInput";
import { openFilterModal, type FilterValues } from "./HomeFilterModal";

export function HomeHero() {
  const router = useRouter();
  const [tab, setTab] = useState<"rent" | "buy">("rent");
  const [petAllow, setPetAllow] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    type: null,
    minPrice: "",
    maxPrice: "",
    bedrooms: null,
  });

  const selectClass = classNames(
    "h-[46px] rounded-md border border-gray-300 bg-white px-[18px]",
    "text-sm font-semibold text-neutral-600 shadow-sm cursor-pointer",
    "hover:border-gray-400 transition-colors truncate text-left",
  );

  const typeLabel = filters.type
    ? (HOME_HERO_FILTER_OPTIONS.types.find((o) => o.value === filters.type)?.label ?? "Type")
    : "Type";

  const priceLabel = (() => {
    if (!filters.minPrice && !filters.maxPrice) return "Price";
    if (filters.minPrice && filters.maxPrice)
      return `฿${Number(filters.minPrice).toLocaleString()} – ฿${Number(filters.maxPrice).toLocaleString()}`;
    if (filters.minPrice) return `฿${Number(filters.minPrice).toLocaleString()}+`;
    return `Up to ฿${Number(filters.maxPrice).toLocaleString()}`;
  })();

  const bedroomsLabel = filters.bedrooms
    ? (HOME_HERO_FILTER_OPTIONS.bedrooms.find((o) => o.value === filters.bedrooms)?.label ?? "Bedrooms")
    : "Bedrooms";

  const openModal = (initialTab: "type" | "price" | "bedrooms") => {
    openFilterModal({
      initialTab,
      initialValues: filters,
      onApply: setFilters,
    });
  };

  const handleSearch = (params: { q?: string; provinceId?: string; districtId?: string; subDistrictIds?: string; stationIds?: string }) => {
    const urlParams = new URLSearchParams();
    urlParams.set("tab", tab === "rent" ? "rent" : "buy");
    if (params.q) urlParams.set("q", params.q);
    if (params.provinceId) urlParams.set("provinceId", params.provinceId);
    if (params.districtId) urlParams.set("districtId", params.districtId);
    if (params.subDistrictIds) urlParams.set("subDistrictIds", params.subDistrictIds);
    if (params.stationIds) urlParams.set("stationIds", params.stationIds);
    if (filters.type) urlParams.set("type", filters.type);
    if (filters.bedrooms) urlParams.set("bedrooms", filters.bedrooms);
    if (filters.minPrice) urlParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) urlParams.set("maxPrice", filters.maxPrice);
    router.push(`/properties?${urlParams.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-[url('/banner.webp')] bg-cover bg-center text-white md:h-[698px] md:overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/90 via-secondary-950/70 to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-3 px-5 pt-16 text-center md:absolute md:left-0 md:right-0 md:top-[190px] md:gap-2.5 md:px-6 md:pt-0">
        <Image
          src="/logo-full.svg"
          alt="Executive Homes"
          width={180}
          height={92}
          className="mb-2 h-24 w-[188px] animate-fade-up [animation-delay:0ms] md:h-[120px] md:w-[235px]"
        />
        <h1 className="max-w-[340px] animate-fade-up text-[32px] font-black leading-[1.12] tracking-tight [animation-delay:100ms] md:max-w-[699px] md:text-[40px] md:leading-[1.5]">
          Your Gateway to Elite Living
        </h1>
        <p className="max-w-[340px] animate-fade-up text-sm font-normal leading-6 text-white/90 [animation-delay:300ms] md:max-w-none md:text-lg md:leading-[1.5]">
          Find the right place, at the best price,{" "}
          <span className="whitespace-nowrap">hassle-free</span>
        </p>
      </div>

      <div className="relative z-50 mt-8 w-full max-w-3xl px-4 pb-8 md:absolute md:bottom-10 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:translate-y-1/2 md:px-6 md:pb-0 lg:px-0">
        <div className="mx-auto mb-4 grid w-full max-w-[280px] grid-cols-2 items-center rounded-lg border border-white/40 bg-black/60 p-1 md:flex md:w-fit md:max-w-none">
          {(["rent", "buy"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={classNames(
                "rounded-md px-4 py-2.5 text-base font-semibold capitalize text-white transition-all md:px-[38px] md:py-2",
                tab === t ? "bg-gradient-to-b from-primary-500 to-primary-400" : "",
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgb(17_24_39/0.16)] md:rounded-xl md:p-[22px] md:shadow-[0_4px_12px_rgb(17_24_39/0.08)]">
          <HomeSearchInput tab={tab} onSearch={handleSearch} />

          <div className="mt-3 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
            <button
              type="button"
              onClick={() => openModal("type")}
              className={classNames(
                selectClass,
                "min-w-0 md:flex-1",
                filters.type ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {typeLabel}
            </button>

            <button
              type="button"
              onClick={() => openModal("price")}
              className={classNames(
                selectClass,
                "min-w-0 md:flex-1",
                filters.minPrice || filters.maxPrice ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {priceLabel}
            </button>

            <button
              type="button"
              onClick={() => openModal("bedrooms")}
              className={classNames(
                selectClass,
                "min-w-0 md:flex-1",
                filters.bedrooms ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {bedroomsLabel}
            </button>

            <div className="col-span-2 flex justify-end self-center md:col-span-1">
              <HomePetToggle value={petAllow} onChange={setPetAllow} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
