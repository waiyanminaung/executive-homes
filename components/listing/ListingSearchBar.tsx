"use client";

import { useState } from "react";
import { Button, Input, Select, SelectOption } from "@geckoui/geckoui";
import { Search } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { classNames } from "@/utils/classNames";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { HomePetToggle } from "@/app/components/home/HomePetToggle";

export function ListingSearchBar() {
  const [, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("buy"));
  const [type, setType] = useQueryState("type");
  const [location, setLocation] = useQueryState("location");
  const [price, setPrice] = useQueryState("price");
  const [bedrooms, setBedrooms] = useQueryState("bedrooms");
  const [pet, setPet] = useQueryState("pet", parseAsBoolean.withDefault(false));

  const [inputKeyword, setInputKeyword] = useState("");

  const selectClass = classNames(
    "h-[46px] rounded-md border border-border bg-white px-[18px]",
    "text-sm font-semibold text-neutral-600 shadow-none",
  );

  const handleSearch = () => {
    void setQ(inputKeyword.trim() || null);
  };

  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-[1292px] px-4 py-5 md:px-6 xl:px-0">
        <div className="flex flex-col gap-3 md:flex-row md:gap-2">
          <Input
            aria-label="Search keyword"
            placeholder="City, community or building"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border-border [&:focus-within]:border-primary-500"
            inputClassName="h-[46px] text-sm font-medium text-neutral-900"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={handleSearch}
            className="h-[46px] rounded-md bg-gradient-to-b from-primary-500 to-primary-400 px-[30px] text-sm font-semibold !text-white hover:bg-gradient-to-b"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
          <Select
            value={tab}
            onChange={(v) => void setTab(v ?? "buy")}
            placeholder="Buy / Rent"
            className={selectClass}
            wrapperClassName="min-w-0 md:flex-1"
          >
            <SelectOption value="buy" label="Buy" />
            <SelectOption value="rent" label="Rent" />
          </Select>

          <Select
            value={location}
            onChange={(v) => void setLocation(v)}
            placeholder="Location"
            className={selectClass}
            wrapperClassName="min-w-0 md:flex-1"
          >
            {HOME_HERO_FILTER_OPTIONS.locations.map((o) => (
              <SelectOption key={o.value} value={o.value} label={o.label} />
            ))}
          </Select>

          <Select
            value={type}
            onChange={(v) => void setType(v)}
            placeholder="Property type"
            className={selectClass}
            wrapperClassName="min-w-0 md:flex-1"
          >
            {HOME_HERO_FILTER_OPTIONS.types.map((o) => (
              <SelectOption key={o.value} value={o.value} label={o.label} />
            ))}
          </Select>

          <Select
            value={price}
            onChange={(v) => void setPrice(v)}
            placeholder="Price"
            className={selectClass}
            wrapperClassName="min-w-0 md:flex-1"
          >
            {HOME_HERO_FILTER_OPTIONS.prices.map((o) => (
              <SelectOption key={o.value} value={o.value} label={o.label} />
            ))}
          </Select>

          <Select
            value={bedrooms}
            onChange={(v) => void setBedrooms(v)}
            placeholder="Beds & Baths"
            className={selectClass}
            wrapperClassName="min-w-0 md:flex-1"
          >
            {HOME_HERO_FILTER_OPTIONS.bedrooms.map((o) => (
              <SelectOption key={o.value} value={o.value} label={o.label} />
            ))}
          </Select>

          <div className="col-span-2 flex justify-end self-center md:col-span-1">
            <HomePetToggle value={pet} onChange={(v) => void setPet(v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
