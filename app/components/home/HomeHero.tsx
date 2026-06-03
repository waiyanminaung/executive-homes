"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button, Input, Select, SelectOption } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { HomePetToggle } from "./HomePetToggle";

export function HomeHero() {
  const [tab, setTab] = useState<"rent" | "buy">("rent");
  const [type, setType] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [petAllow, setPetAllow] = useState(false);

  const selectClass = classNames(
    "h-[46px] rounded-md border border-[#e5e5ea] bg-white px-[18px]",
    "text-sm font-semibold text-neutral-600 shadow-none",
  );

  return (
    <section className="relative h-[698px] overflow-visible bg-[url('https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2400&q=90')] bg-cover bg-center text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#011023]/90 via-[#011023]/70 to-transparent" />

      <div className="absolute left-0 right-0 top-[301px] flex flex-col items-center gap-2.5 px-6 text-center">
        <h1 className="max-w-[699px] animate-fade-up text-[40px] font-black leading-[1.5] tracking-tight [animation-delay:100ms]">
          Your Gateway to Elite Living
        </h1>
        <p className="animate-fade-up text-lg font-normal leading-[1.5] text-white/90 [animation-delay:300ms]">
          Find the right place, at the best price, hassle-free
        </p>
      </div>

      <div className="absolute left-1/2 top-[560px] z-50 w-full max-w-[954px] -translate-x-1/2 animate-fade-up px-6 [animation-delay:500ms] lg:px-0">
        <div className="mb-4 flex w-fit mx-auto items-center rounded-lg border border-white/40 bg-black/60 p-1">
          {(["rent", "buy"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={classNames(
                "rounded-md px-[38px] py-2 text-base font-semibold capitalize text-white transition-all",
                tab === t ? "bg-gradient-to-b from-[#ae894c] to-[#d4bc83]" : "",
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-white p-[22px] shadow-[0_4px_12px_rgb(17_24_39/0.08)]">
          <div className="flex gap-2">
            <Input
              aria-label="Search keyword"
              placeholder="Type keyword..."
              className="flex-1 border-[#e5e5ea] [&:focus-within]:border-[#ae894c]"
              inputClassName="h-[46px] text-sm font-medium text-neutral-900"
            />
            <Button
              type="button"
              className="h-[46px] rounded-md bg-gradient-to-b from-[#ae894c] to-[#d4bc83] px-[30px] text-sm font-semibold text-white"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <Select
              value={type}
              onChange={setType}
              placeholder="Type"
              className={selectClass}
              wrapperClassName="flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.types.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={location}
              onChange={setLocation}
              placeholder="Location"
              className={selectClass}
              wrapperClassName="flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.locations.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={price}
              onChange={setPrice}
              placeholder="Price"
              className={selectClass}
              wrapperClassName="flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.prices.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={bedrooms}
              onChange={setBedrooms}
              placeholder="Bedrooms"
              className={selectClass}
              wrapperClassName="flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.bedrooms.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <div className="self-center">
              <HomePetToggle value={petAllow} onChange={setPetAllow} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
