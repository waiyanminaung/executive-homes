"use client";

import Image from "next/image";
import { ChevronDown, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { classNames } from "@/utils/classNames";
import { getMediaUrl } from "@/utils/getMediaUrl";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import HomeAreaCardForm from "./HomeAreaCardForm";

interface HomeAreaCardRowProps {
  card: HomeAreaCard;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function HomeAreaCardRow({
  card,
  isExpanded,
  onToggle,
  onSaved,
  onDeleted,
}: HomeAreaCardRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

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
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={getMediaUrl(card.imageKey)}
              alt={card.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{card.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {card.district
                ? `${card.district.name} district`
                : card.province
                  ? `${card.province.name} province`
                  : "No location linked"}
              {` · order ${card.order}`}
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
        <HomeAreaCardForm
          card={card}
          onSaved={onSaved}
          onCancel={onToggle}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
