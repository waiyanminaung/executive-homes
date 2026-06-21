"use client";

import { Search, ChevronRight } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";

export interface Province { id: string; name: string; }

interface LocationPickerProvinceViewProps {
  search: string;
  onSearchChange: (v: string) => void;
  provinces: Province[];
  loading: boolean;
  onSelect: (province: Province) => void;
}

export default function LocationPickerProvinceView({
  search,
  onSearchChange,
  provinces,
  loading,
  onSelect,
}: LocationPickerProvinceViewProps) {
  const filtered = provinces.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search province…"
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 min-w-0"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-5 h-5 text-primary-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <Search className="w-8 h-8 text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">No results for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {filtered.map((province) => (
            <li key={province.id}>
              <button
                onClick={() => onSelect(province)}
                className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 text-left transition-colors"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-primary-100 text-[11px] font-bold text-gray-500 group-hover:text-primary-700 shrink-0 transition-colors">
                  {province.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-sm text-gray-700 group-hover:text-primary-900 font-medium transition-colors">
                  {province.name}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
