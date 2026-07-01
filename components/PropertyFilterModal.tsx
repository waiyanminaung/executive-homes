"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog } from "@geckoui/geckoui";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { classNames } from "@/utils/classNames";
import { PropertyFilterOptionButton } from "@/components/PropertyFilterOptionButton";
import { PropertyFilterTypeOptions } from "@/components/PropertyFilterTypeOptions";

export type FilterTab = "type" | "price" | "bedrooms";

export interface FilterValues {
  type: string | null;
  minPrice: string;
  maxPrice: string;
  bedrooms: string | null;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "type", label: "Type" },
  { key: "price", label: "Price" },
  { key: "bedrooms", label: "Bedrooms" },
];

export function openFilterModal(opts: {
  initialTab: FilterTab;
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
  showTypeTab?: boolean;
}) {
  Dialog.show({
    className: "w-full max-w-sm p-0 overflow-hidden",
    content: ({ dismiss }) => (
      <PropertyFilterModal
        initialTab={opts.initialTab}
        initialValues={opts.initialValues}
        showTypeTab={opts.showTypeTab ?? true}
        onApply={(values) => {
          opts.onApply(values);
          dismiss();
        }}
        dismiss={dismiss}
      />
    ),
  });
}

interface PropertyFilterModalProps {
  initialTab: FilterTab;
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
  dismiss: () => void;
  showTypeTab: boolean;
}

function PropertyFilterModal({ initialTab, initialValues, onApply, dismiss, showTypeTab }: PropertyFilterModalProps) {
  const tabs = showTypeTab ? TABS : TABS.filter((tab) => tab.key !== "type");
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const [localType, setLocalType] = useState<string | null>(initialValues.type);
  const [localMinPrice, setLocalMinPrice] = useState(initialValues.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(initialValues.maxPrice);
  const [localBedrooms, setLocalBedrooms] = useState<string | null>(initialValues.bedrooms);

  const handleClear = () => {
    if (activeTab === "type") {
      setLocalType(null);
      onApply({ type: null, minPrice: localMinPrice, maxPrice: localMaxPrice, bedrooms: localBedrooms });
    } else if (activeTab === "price") {
      setLocalMinPrice("");
      setLocalMaxPrice("");
      onApply({ type: localType, minPrice: "", maxPrice: "", bedrooms: localBedrooms });
    } else {
      setLocalBedrooms(null);
      onApply({ type: localType, minPrice: localMinPrice, maxPrice: localMaxPrice, bedrooms: null });
    }
    dismiss();
  };

  return (
    <div className="flex flex-col" style={{ height: "72vh", maxHeight: 520 }}>
      <div className="shrink-0 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <h2 className="flex-1 text-sm font-bold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={classNames(
                "-mb-px flex-1 border-b-2 py-2.5 text-sm font-semibold transition-colors",
                activeTab === tab.key
                  ? "border-primary-700 text-primary-700"
                  : "border-transparent text-gray-500 hover:text-gray-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
        {activeTab === "type" && <PropertyFilterTypeOptions value={localType} onChange={setLocalType} />}

        {activeTab === "price" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Minimum</p>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                  ฿
                </span>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="Min"
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Maximum</p>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                  ฿
                </span>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "bedrooms" && (
          <div className="grid grid-cols-3 gap-2">
            {HOME_HERO_FILTER_OPTIONS.bedrooms.map((o) => {
              const selected = localBedrooms === o.value;
              return (
                <PropertyFilterOptionButton
                  key={o.value}
                  label={o.label}
                  selected={selected}
                  hasSelection={!!localBedrooms}
                  onClick={() => setLocalBedrooms(selected ? null : o.value)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-800"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => onApply({ type: localType, minPrice: localMinPrice, maxPrice: localMaxPrice, bedrooms: localBedrooms })}
          className="flex-1 rounded-xl bg-primary-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 active:bg-primary-900"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
