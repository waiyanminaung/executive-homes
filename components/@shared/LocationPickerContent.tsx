"use client";

import { useState } from "react";
import { ArrowLeft, X, MapPin } from "lucide-react";
import { useRead } from "@/lib/spoosh";
import LocationPickerProvinceView, { type Province as PickerProvince } from "./LocationPickerProvinceView";
import LocationPickerDistrictView from "./LocationPickerDistrictView";
import type { LocationSelection } from "./LocationPickerDialog";

interface Props {
  onApply: (selection: LocationSelection) => void;
  onClose: () => void;
}

export default function LocationPickerContent({ onApply, onClose }: Props) {
  const [view, setView] = useState<"province" | "district">("province");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<PickerProvince | null>(null);
  const [pendingDistrictId, setPendingDistrictId] = useState<string | null>(null);
  const [deselectedSubIds, setDeselectedSubIds] = useState<Set<string>>(new Set());

  const { data: provincesData, loading: provincesLoading } = useRead((api) =>
    api("locations/provinces").GET(),
  );

  const { data: districtsData, loading: districtsLoading } = useRead((api) =>
    api("locations/districts").GET({ query: { provinceId: selectedProvince?.id ?? "" } }),
  );

  const { data: subDistrictsData, loading: subDistrictsLoading } = useRead((api) =>
    api("locations/subdistricts").GET({ query: { districtId: pendingDistrictId ?? "" } }),
  );

  const provinces = provincesData?.provinces ?? [];
  const districts = districtsData?.districts ?? [];
  const subDistricts = subDistrictsData?.subDistricts ?? [];

  const handleProvinceSelect = (province: PickerProvince) => {
    setSelectedProvince(province);
    setPendingDistrictId(null);
    setDeselectedSubIds(new Set());
    setDistrictSearch("");
    setView("district");
  };

  const handleDistrictSelect = (districtId: string | null) => {
    setPendingDistrictId(districtId);
    setDeselectedSubIds(new Set());
  };

  const handleSubDistrictToggle = (id: string) => {
    setDeselectedSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setDeselectedSubIds(checked ? new Set() : new Set(subDistricts.map((s) => s.id)));
  };

  const handleClear = () => {
    setView("province");
    setSelectedProvince(null);
    setPendingDistrictId(null);
    setDeselectedSubIds(new Set());
    setProvinceSearch("");
    setDistrictSearch("");
    onApply({ provinceId: null, districtId: null, subDistrictIds: null, provinceName: null, districtName: null, subDistrictNames: null });
  };

  const handleApply = () => {
    if (!selectedProvince) {
      onApply({ provinceId: null, districtId: null, subDistrictIds: null, provinceName: null, districtName: null, subDistrictNames: null });
      return;
    }

    const isAllSubs = deselectedSubIds.size === 0 || subDistricts.length === 0;
    const specificSubIds = isAllSubs
      ? null
      : subDistricts.filter((s) => !deselectedSubIds.has(s.id)).map((s) => s.id);

    const selectedDistrict = districts.find((d) => d.id === pendingDistrictId);

    const selectedSubNames = specificSubIds
      ? subDistricts.filter((s) => specificSubIds.includes(s.id)).map((s) => s.name)
      : null;

    onApply({
      provinceId: selectedProvince.id,
      districtId: pendingDistrictId,
      subDistrictIds: pendingDistrictId ? specificSubIds : null,
      provinceName: selectedProvince.name,
      districtName: selectedDistrict?.name ?? null,
      subDistrictNames: pendingDistrictId ? selectedSubNames : null,
    });
  };

  return (
    <div className="flex flex-col" style={{ height: "72vh", maxHeight: 600 }}>
      <div className="shrink-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          {view === "district" ? (
            <button
              onClick={() => setView("province")}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0">
              <MapPin className="w-4 h-4 text-primary-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {view === "district" && (
              <p className="text-[11px] font-medium text-primary-500 uppercase tracking-wide leading-none mb-0.5">
                Province
              </p>
            )}
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {view === "province" ? "Filter by Location" : selectedProvince?.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {view === "district" && selectedProvince && (
          <div className="px-4 pb-3">
            <span className="text-xs text-gray-400">Choose a district or apply at province level</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {view === "province" ? (
          <LocationPickerProvinceView
            search={provinceSearch}
            onSearchChange={setProvinceSearch}
            provinces={provinces}
            loading={provincesLoading}
            onSelect={handleProvinceSelect}
          />
        ) : (
          <LocationPickerDistrictView
            search={districtSearch}
            onSearchChange={setDistrictSearch}
            districts={districts}
            districtsLoading={districtsLoading}
            pendingDistrictId={pendingDistrictId}
            onDistrictSelect={handleDistrictSelect}
            subDistricts={subDistricts}
            subDistrictsLoading={subDistrictsLoading}
            deselectedSubIds={deselectedSubIds}
            onSubDistrictToggle={handleSubDistrictToggle}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      <div className="shrink-0 bg-white border-t border-gray-100 flex items-center gap-3 px-4 py-3">
        <button
          onClick={handleClear}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-2.5 rounded-xl bg-primary-700 text-sm font-semibold text-white hover:bg-primary-800 active:bg-primary-900 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
