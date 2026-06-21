"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRead, useWrite } from "@/lib/spoosh";
import type { HomeSection } from "@/types/homeSection";
import AdminPageHeader from "../../components/AdminPageHeader";
import HomeSectionRow from "./components/HomeSectionRow";
import HomeSectionForm from "./components/HomeSectionForm";

export default function AdminHomePage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/home-sections").GET());
  const { trigger: updateSection } = useWrite((api) => api("admin/home-sections/:id").PATCH());
  const [expandedId, setExpandedId] = useState<string | "new" | null>(null);
  const [orderIds, setOrderIds] = useState<string[] | null>(null);

  const serverSections = data?.sections ?? [];
  const orderedSections: HomeSection[] = orderIds
    ? orderIds.map((id) => serverSections.find((s) => s.id === id)).filter((s): s is HomeSection => !!s)
    : serverSections;

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSaved = () => {
    setExpandedId(null);
    setOrderIds(null);
    refetch();
  };

  const handleDeleted = () => {
    setExpandedId(null);
    setOrderIds(null);
    refetch();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex((s) => s.id === active.id);
    const newIndex = orderedSections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(orderedSections, oldIndex, newIndex);

    setOrderIds(reordered.map((s) => s.id));

    await Promise.all(
      reordered
        .map((section, index) =>
          section.order !== index
            ? updateSection({ params: { id: section.id }, body: { order: index } })
            : null,
        )
        .filter(Boolean),
    );
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Home Page Sections"
        description="Configure the property listing sections shown on the home page."
        actions={
          <button
            onClick={() => setExpandedId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {orderedSections.length === 0 && expandedId !== "new" && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No sections yet. Add your first one.</p>
            </div>
          )}

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {orderedSections.map((section) => (
                  <HomeSectionRow
                    key={section.id}
                    section={section}
                    isExpanded={expandedId === section.id}
                    onToggle={() => handleToggle(section.id)}
                    onSaved={handleSaved}
                    onDeleted={handleDeleted}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {expandedId === "new" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">New Section</p>
              </div>
              <HomeSectionForm
                section={null}
                onSaved={handleSaved}
                onCancel={() => setExpandedId(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
