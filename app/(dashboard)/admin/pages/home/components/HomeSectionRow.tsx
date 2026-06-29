"use client";

import { ChevronDown, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { classNames } from "@/utils/classNames";
import type { HomeSection } from "@/types/homeSection";
import HomeSectionForm from "./HomeSectionForm";

const LISTING_LABELS: Record<string, string> = {
  RENT: "Rent",
  SALE: "Sale",
};

interface HomeSectionRowProps {
  section: HomeSection;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function HomeSectionRow({ section, isExpanded, onToggle, onSaved, onDeleted }: HomeSectionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className="flex items-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="px-3 py-4 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 pr-5 py-4 text-left hover:bg-gray-50 transition-colors min-w-0"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{section.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {LISTING_LABELS[section.listingType] ?? section.listingType}
              {section.propertyType ? ` · ${section.propertyType.name}` : ""}
              {section.province ? ` · ${section.province.name}` : ""}
              {section.district ? ` › ${section.district.name}` : ""}
              {` · max ${section.limit}`}
            </p>
          </div>

          <ChevronDown
            className={classNames(
              "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      {isExpanded && (
        <HomeSectionForm
          section={section}
          onSaved={onSaved}
          onCancel={onToggle}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
