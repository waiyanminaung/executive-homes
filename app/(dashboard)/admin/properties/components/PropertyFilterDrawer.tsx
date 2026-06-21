"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Drawer } from "@geckoui/geckoui";
import FilterSelects, { type FilterSelectsProps } from "./FilterSelects";

interface PropertyFilterDrawerProps extends FilterSelectsProps {
  open: boolean;
  activeCount: number;
  onClose: () => void;
  onClear: () => void;
  onLocationClick: () => void;
}

export default function PropertyFilterDrawer({
  open,
  activeCount,
  onClose,
  onClear,
  onLocationClick,
  ...filterProps
}: PropertyFilterDrawerProps) {
  return (
    <Drawer
      open={open}
      placement="right"
      handleClose={onClose}
      allowClickOutside
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Filters</h2>
            {activeCount > 0 && (
              <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-1.5 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterSelects {...filterProps} onLocationClick={onLocationClick} vertical />
        </div>

        {activeCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => { onClear(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
