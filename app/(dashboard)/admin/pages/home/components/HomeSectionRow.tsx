import { ChevronDown } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeSection } from "@/types/homeSection";
import HomeSectionForm from "./HomeSectionForm";

const LISTING_LABELS: Record<string, string> = {
  RENT: "Rent",
  SALE: "Sale",
  BOTH: "Rent & Sale",
};

interface HomeSectionRowProps {
  section: HomeSection;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function HomeSectionRow({ section, isExpanded, onToggle, onSaved, onDeleted }: HomeSectionRowProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
          {section.order}
        </span>

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
