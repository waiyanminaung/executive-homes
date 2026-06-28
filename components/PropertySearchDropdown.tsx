"use client";

import { MapPin, Train } from "lucide-react";

interface PropertySearchDropdownProps {
  pos: { top: number; left: number; width: number };
  onProvinceClick: () => void;
  onTransitClick: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function PropertySearchDropdown({ pos, onProvinceClick, onTransitClick, dropdownRef }: PropertySearchDropdownProps) {
  return (
    <div
      ref={dropdownRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onProvinceClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary-500" />
        Search by Province
      </button>
      <div className="mx-4 border-t border-gray-100" />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onTransitClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Train className="h-4 w-4 shrink-0 text-primary-500" />
        Search by BTS/MRT
      </button>
    </div>
  );
}
