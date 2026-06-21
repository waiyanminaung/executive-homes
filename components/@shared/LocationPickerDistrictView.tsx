"use client";

import { Search, Check } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface District { id: string; name: string; }
interface SubDistrict { id: string; name: string; }

interface LocationPickerDistrictViewProps {
  search: string;
  onSearchChange: (v: string) => void;
  districts: District[];
  districtsLoading: boolean;
  pendingDistrictId: string | null;
  onDistrictSelect: (id: string | null) => void;
  subDistricts: SubDistrict[];
  subDistrictsLoading: boolean;
  deselectedSubIds: Set<string>;
  onSubDistrictToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span className={classNames(
      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
      selected ? "border-primary-600 bg-primary-50" : "border-gray-300",
    )}>
      {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
    </span>
  );
}

function CheckSquare({ checked }: { checked: boolean }) {
  return (
    <span className={classNames(
      "w-4.5 h-4.5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-colors",
      checked ? "border-primary-600 bg-primary-600" : "border-gray-300 bg-white",
    )}>
      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
    </span>
  );
}

export default function LocationPickerDistrictView({
  search,
  onSearchChange,
  districts,
  districtsLoading,
  pendingDistrictId,
  onDistrictSelect,
  subDistricts,
  subDistrictsLoading,
  deselectedSubIds,
  onSubDistrictToggle,
  onSelectAll,
}: LocationPickerDistrictViewProps) {
  const filtered = districts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isSelectAllChecked = deselectedSubIds.size === 0;
  const selectedCount = subDistricts.length - deselectedSubIds.size;

  return (
    <>
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search district…"
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 min-w-0"
          />
        </div>
      </div>

      {districtsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-5 h-5 text-primary-400" />
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          <li>
            <button
              onClick={() => onDistrictSelect(null)}
              className={classNames(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                pendingDistrictId === null ? "bg-primary-50" : "hover:bg-gray-50",
              )}
            >
              <RadioDot selected={pendingDistrictId === null} />
              <span className={classNames(
                "text-sm font-semibold transition-colors",
                pendingDistrictId === null ? "text-primary-700" : "text-gray-600",
              )}>
                All Districts
              </span>
            </button>
          </li>

          {filtered.map((district) => {
            const isSelected = pendingDistrictId === district.id;

            return (
              <li key={district.id}>
                <button
                  onClick={() => onDistrictSelect(district.id)}
                  className={classNames(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    isSelected ? "bg-primary-50 border-l-2 border-primary-500" : "hover:bg-gray-50 border-l-2 border-transparent",
                  )}
                >
                  <RadioDot selected={isSelected} />
                  <span className={classNames(
                    "text-sm font-medium flex-1 transition-colors",
                    isSelected ? "text-primary-800" : "text-gray-700",
                  )}>
                    {district.name}
                  </span>
                </button>

                {isSelected && (
                  <div className="border-t border-primary-100 bg-gray-50">
                    {subDistrictsLoading ? (
                      <div className="flex items-center justify-center py-5">
                        <Spinner className="w-4 h-4 text-primary-400" />
                      </div>
                    ) : subDistricts.length === 0 ? null : (
                      <>
                        <button
                          onClick={() => onSelectAll(!isSelectAllChecked)}
                          className="w-full flex items-center gap-2.5 pl-11 pr-4 py-2.5 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <CheckSquare checked={isSelectAllChecked} />
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Select All
                          </span>
                          <span className="ml-auto text-xs text-gray-400">
                            {selectedCount}/{subDistricts.length}
                          </span>
                        </button>

                        <div className="max-h-48 overflow-y-auto">
                          {subDistricts.map((sub) => {
                            const checked = !deselectedSubIds.has(sub.id);
                            return (
                              <button
                                key={sub.id}
                                onClick={() => onSubDistrictToggle(sub.id)}
                                className="w-full flex items-center gap-2.5 pl-11 pr-4 py-2.5 border-b border-gray-100 last:border-0 hover:bg-primary-50/50 transition-colors"
                              >
                                <CheckSquare checked={checked} />
                                <span className={classNames(
                                  "text-sm transition-colors",
                                  checked ? "text-gray-700" : "text-gray-400",
                                )}>
                                  {sub.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
