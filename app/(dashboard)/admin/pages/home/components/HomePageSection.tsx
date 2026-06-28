"use client";

import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface HomePageSectionProps<T extends { id: string; order: number }> {
  title: string;
  addLabel: string;
  newFormLabel: string;
  loading: boolean;
  items: T[];
  expandedId: string | "new" | null;
  emptyMessage: string;
  topContent?: React.ReactNode;
  onAdd: () => void;
  onDragEnd: (event: DragEndEvent) => void;
  renderRow: (item: T) => React.ReactNode;
  renderNewForm: () => React.ReactNode;
}

export default function HomePageSection<T extends { id: string; order: number }>({
  title,
  addLabel,
  newFormLabel,
  loading,
  items,
  expandedId,
  emptyMessage,
  topContent,
  onAdd,
  onDragEnd,
  renderRow,
  renderNewForm,
}: HomePageSectionProps<T>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {topContent && (
            <div className="border-b border-gray-100 pb-3">
              {topContent}
            </div>
          )}

          {items.length === 0 && expandedId !== "new" && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">{emptyMessage}</p>
            </div>
          )}

          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((item) => renderRow(item))}
              </div>
            </SortableContext>
          </DndContext>

          {expandedId === "new" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{newFormLabel}</p>
              </div>
              {renderNewForm()}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
