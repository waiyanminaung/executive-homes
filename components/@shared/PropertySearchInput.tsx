"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { Button, Input } from "@geckoui/geckoui";
import { useRouter } from "next/navigation";
import { classNames } from "@/utils/classNames";
import { useAnimatedPlaceholder } from "@/utils/useAnimatedPlaceholder";
import { usePropertySearch, type SearchResult } from "@/utils/usePropertySearch";
import { openLocationPicker } from "@/components/@shared/LocationPickerDialog";
import { openTransitStationPicker } from "@/components/@shared/TransitStationPickerModal";
import { PropertySearchDropdown } from "@/components/PropertySearchDropdown";
import { useDropdownAnchor } from "@/utils/useDropdownAnchor";

const PLACEHOLDER_PHRASES = ["Provinces", "BTS / MRT Stations", "Bangkok", "Condo, Townhouse..."];

export interface PropertySearchParams {
  q?: string;
  provinceId?: string;
  districtId?: string;
  subDistrictIds?: string;
  stationIds?: string;
  locationLabel?: string;
}

interface PropertySearchInputProps {
  onApply: (params: PropertySearchParams) => void;
  showSearchButton?: boolean;
  className?: string;
  inputClassName?: string;
}

export function PropertySearchInput({ onApply, showSearchButton, className, inputClassName }: PropertySearchInputProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [subDistrictIds, setSubDistrictIds] = useState<string[]>([]);
  const [stationIds, setStationIds] = useState<string[]>([]);

  const animatedPlaceholder = useAnimatedPlaceholder(PLACEHOLDER_PHRASES, inputValue !== "" || isFocused);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { anchorRef, dropdownOpen, dropdownPos, openDropdown, closeDropdown } = useDropdownAnchor(dropdownRef);

  const { results, loading } = usePropertySearch(inputValue);
  const hasQuery = inputValue.trim().length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setProvinceId(null);
    setDistrictId(null);
    setSubDistrictIds([]);
    setStationIds([]);
  };

  const handleClear = () => {
    setInputValue("");
    setProvinceId(null);
    setDistrictId(null);
    setSubDistrictIds([]);
    setStationIds([]);

    if (!showSearchButton) {
      onApply({});
    }
  };

  const buildParams = (): PropertySearchParams => {
    if (stationIds.length > 0) return { stationIds: stationIds.join(",") };
    if (subDistrictIds.length > 0) return { provinceId: provinceId ?? undefined, districtId: districtId ?? undefined, subDistrictIds: subDistrictIds.join(",") };
    if (districtId) return { provinceId: provinceId ?? undefined, districtId };
    if (provinceId) return { provinceId };
    return { q: inputValue.trim() || undefined };
  };

  const applyIfListing = (params: PropertySearchParams) => {
    if (!showSearchButton) onApply(params);
  };

  const handleResultClick = (result: SearchResult) => {
    closeDropdown();

    if (result.type === "property" && result.slug) {
      router.push(`/properties/${result.slug}`);
      return;
    }

    setInputValue(result.name);

    if (result.type === "station" && result.stationId) {
      setStationIds([result.stationId]);
      setProvinceId(null);
      setDistrictId(null);
      setSubDistrictIds([]);
      applyIfListing({ stationIds: result.stationId, locationLabel: result.name });
      return;
    }

    setStationIds([]);
    setProvinceId(result.provinceId ?? null);
    setDistrictId(result.districtId ?? null);
    setSubDistrictIds(result.subDistrictId ? [result.subDistrictId] : []);

    const params: PropertySearchParams = { provinceId: result.provinceId, locationLabel: result.name };
    if (result.districtId) params.districtId = result.districtId;
    if (result.subDistrictId) params.subDistrictIds = result.subDistrictId;
    applyIfListing(params);
  };

  const handleProvinceClick = () => {
    closeDropdown();
    openLocationPicker({
      onApply: (sel) => {
        if (!sel.provinceName) return;

        let display: string;
        if (sel.subDistrictNames && sel.subDistrictNames.length > 0) {
          display = sel.subDistrictNames.join(", ");
        } else if (sel.districtName) {
          display = sel.districtName;
        } else {
          display = sel.provinceName;
        }

        setInputValue(display);
        setProvinceId(sel.provinceId);
        setDistrictId(sel.districtId);
        setSubDistrictIds(sel.subDistrictIds ?? []);
        setStationIds([]);

        if (!showSearchButton) {
          const ids = sel.subDistrictIds ?? [];
          if (ids.length > 0) {
            onApply({ provinceId: sel.provinceId ?? undefined, districtId: sel.districtId ?? undefined, subDistrictIds: ids.join(","), locationLabel: display });
          } else if (sel.districtId) {
            onApply({ provinceId: sel.provinceId ?? undefined, districtId: sel.districtId, locationLabel: display });
          } else {
            onApply({ provinceId: sel.provinceId ?? undefined, locationLabel: display });
          }
        }
      },
    });
  };

  const handleTransitClick = () => {
    closeDropdown();
    openTransitStationPicker({
      selectedIds: stationIds,
      onConfirmWithStations: (stations) => {
        const display = stations.length <= 2
          ? stations.map((s) => s.name).join(", ")
          : `${stations.length} BTS/MRT Stations`;
        setInputValue(display);
        setStationIds(stations.map((s) => s.id));
        setProvinceId(null);
        setDistrictId(null);
        setSubDistrictIds([]);

        if (!showSearchButton) {
          onApply({ stationIds: stations.map((s) => s.id).join(","), locationLabel: display });
        }
      },
      multiple: true,
      endpoint: "transit-stations",
    });
  };

  const handleSubmit = () => onApply({ ...buildParams(), locationLabel: inputValue.trim() || undefined });

  return (
    <div className={classNames("flex gap-2", className)}>
      <div ref={anchorRef} className="flex-1">
        <Input
          aria-label="Search keyword"
          autoComplete="off"
          placeholder={`Search by ${animatedPlaceholder}`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => { setIsFocused(true); openDropdown(); }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          suffix={inputValue ? (
            <button type="button" onClick={handleClear}>
              <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          ) : undefined}
          className={classNames(
            "border-gray-300 shadow-sm [&:focus-within]:border-primary-500 [&:focus-within]:ring-2 [&:focus-within]:ring-primary-100 px-3.5",
            inputClassName,
          )}
          inputClassName="h-[45px] text-sm font-medium text-neutral-900"
        />
      </div>

      {showSearchButton && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleSubmit}
          className="h-[46px] shrink-0 rounded-md bg-gradient-to-b from-primary-500 to-primary-400 px-[30px] text-sm font-semibold !text-white hover:bg-gradient-to-b"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
      )}

      {dropdownOpen &&
        createPortal(
          <PropertySearchDropdown
            pos={dropdownPos}
            dropdownRef={dropdownRef}
            onProvinceClick={handleProvinceClick}
            onTransitClick={handleTransitClick}
            onResultClick={handleResultClick}
            results={hasQuery ? results : undefined}
            loading={hasQuery ? loading : false}
          />,
          document.body,
        )}
    </div>
  );
}
