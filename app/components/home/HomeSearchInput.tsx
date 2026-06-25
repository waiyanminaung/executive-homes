"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin, Train } from "lucide-react";
import { Button, Input } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openLocationPicker } from "@/components/@shared/LocationPickerDialog";
import { openTransitStationPicker } from "@/components/@shared/TransitStationPickerModal";

const SEARCH_PLACEHOLDER_PHRASES = [
  "Provinces",
  "BTS / MRT Stations",
  "Bangkok",
  "Condo, Townhouse...",
];

interface HomeSearchInputProps {
  tab: "rent" | "buy";
  onSearch: (params: { q?: string; provinceId?: string; stationIds?: string }) => void;
}

export function HomeSearchInput({ onSearch }: HomeSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [stationIds, setStationIds] = useState<string[]>([]);

  const anchorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue !== "" || isFocused) {
      const timer = setTimeout(() => setAnimatedPlaceholder(""), 0);
      return () => clearTimeout(timer);
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let pausing = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = SEARCH_PLACEHOLDER_PHRASES[phraseIdx];

      if (pausing) {
        pausing = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % SEARCH_PLACEHOLDER_PHRASES.length;
        setAnimatedPlaceholder("");
        timer = setTimeout(tick, 300);
        return;
      }

      if (charIdx < phrase.length) {
        setAnimatedPlaceholder(phrase.slice(0, charIdx + 1));
        charIdx++;
        timer = setTimeout(tick, 80);
      } else {
        pausing = true;
        timer = setTimeout(tick, 2000);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [inputValue, isFocused]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        anchorRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;

      setDropdownOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const openDropdownAtAnchor = () => {
    const rect = anchorRef.current?.getBoundingClientRect();

    if (rect) {
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }

    setDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setProvinceId(null);
    setStationIds([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
    openDropdownAtAnchor();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleProvinceClick = () => {
    setDropdownOpen(false);
    openLocationPicker({
      onApply: (sel) => {
        if (!sel.provinceName) return;

        const display = sel.districtName
          ? `${sel.provinceName} › ${sel.districtName}`
          : sel.provinceName;

        setInputValue(display);
        setProvinceId(sel.provinceId);
        setStationIds([]);
      },
    });
  };

  const handleTransitClick = () => {
    setDropdownOpen(false);
    openTransitStationPicker({
      selectedIds: stationIds,
      onConfirm: () => {},
      onConfirmWithStations: (stations) => {
        setInputValue(stations.map((s) => s.name).join(", "));
        setStationIds(stations.map((s) => s.id));
        setProvinceId(null);
      },
      multiple: true,
      endpoint: "transit-stations",
    });
  };

  const handleSearch = () => {
    if (provinceId) {
      onSearch({ provinceId });
    } else if (stationIds.length > 0) {
      onSearch({ stationIds: stationIds.join(",") });
    } else {
      onSearch({ q: inputValue.trim() || undefined });
    }
  };

  return (
    <div className={classNames("flex flex-col gap-3", "md:flex-row md:gap-2")}>
      <div ref={anchorRef} className="flex-1">
        <Input
          aria-label="Search keyword"
          placeholder={animatedPlaceholder || "Search..."}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border-border [&:focus-within]:border-primary-500"
          inputClassName="h-12 text-base font-medium text-neutral-900 md:h-[46px] md:text-sm"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleSearch}
        className="h-12 rounded-md bg-gradient-to-b from-primary-500 to-primary-400 px-[30px] text-base font-semibold !text-white hover:bg-gradient-to-b md:h-[46px] md:text-sm"
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </Button>

      {dropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
            }}
            className="rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleProvinceClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary-500" />
              Search by Province
            </button>
            <div className="mx-4 border-t border-gray-100" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleTransitClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Train className="h-4 w-4 shrink-0 text-primary-500" />
              Search by BTS/MRT
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
