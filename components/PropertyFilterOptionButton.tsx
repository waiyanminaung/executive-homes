"use client";

import { Check } from "lucide-react";
import { classNames } from "@/utils/classNames";

interface PropertyFilterOptionButtonProps {
  label: string;
  selected: boolean;
  hasSelection: boolean;
  onClick: () => void;
}

export function PropertyFilterOptionButton({ label, selected, hasSelection, onClick }: PropertyFilterOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "flex items-center justify-between rounded-xl border-2 px-4 py-2.5 text-left text-sm font-semibold transition-all",
        selected
          ? "border-primary-700 bg-primary-50 text-primary-700"
          : classNames("border-gray-200 bg-white hover:border-gray-300", hasSelection ? "text-gray-400" : "text-gray-700"),
      )}
    >
      <span>{label}</span>
      {selected && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}
