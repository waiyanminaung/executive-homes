"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRead, useWrite } from "@/lib/spoosh";
import type { HomeSection } from "@/types/homeSection";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import AdminPageHeader from "../../components/AdminPageHeader";
import HomeSectionRow from "./components/HomeSectionRow";
import HomeSectionForm from "./components/HomeSectionForm";
import HomeAreaCardRow from "./components/HomeAreaCardRow";
import HomeAreaCardForm from "./components/HomeAreaCardForm";

export default function AdminHomePage() {
  const { data: sectionsData, loading: sectionsLoading, trigger: refetchSections } = useRead(
    (api) => api("admin/home-sections").GET(),
  );
  const { trigger: updateSection } = useWrite((api) => api("admin/home-sections/:id").PATCH());
  const [expandedSectionId, setExpandedSectionId] = useState<string | "new" | null>(null);
  const [sectionOrderIds, setSectionOrderIds] = useState<string[] | null>(null);

  const { data: cardsData, loading: cardsLoading, trigger: refetchCards } = useRead(
    (api) => api("admin/home-area-cards").GET(),
  );
  const { trigger: updateCard } = useWrite((api) => api("admin/home-area-cards/:id").PATCH());
  const [expandedCardId, setExpandedCardId] = useState<string | "new" | null>(null);
  const [cardOrderIds, setCardOrderIds] = useState<string[] | null>(null);

  const serverSections = sectionsData?.sections ?? [];
  const orderedSections: HomeSection[] = sectionOrderIds
    ? sectionOrderIds.map((id) => serverSections.find((s) => s.id === id)).filter((s): s is HomeSection => !!s)
    : serverSections;

  const serverCards = cardsData?.areaCards ?? [];
  const orderedCards: HomeAreaCard[] = cardOrderIds
    ? cardOrderIds.map((id) => serverCards.find((c) => c.id === id)).filter((c): c is HomeAreaCard => !!c)
    : serverCards;

  const handleSectionToggle = (id: string) => {
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  const handleSectionSaved = () => {
    setExpandedSectionId(null);
    setSectionOrderIds(null);
    refetchSections();
  };

  const handleSectionDeleted = () => {
    setExpandedSectionId(null);
    setSectionOrderIds(null);
    refetchSections();
  };

  const handleSectionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex((s) => s.id === active.id);
    const newIndex = orderedSections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(orderedSections, oldIndex, newIndex);

    setSectionOrderIds(reordered.map((s) => s.id));

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

  const handleCardToggle = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleCardSaved = () => {
    setExpandedCardId(null);
    setCardOrderIds(null);
    refetchCards();
  };

  const handleCardDeleted = () => {
    setExpandedCardId(null);
    setCardOrderIds(null);
    refetchCards();
  };

  const handleCardDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedCards.findIndex((c) => c.id === active.id);
    const newIndex = orderedCards.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(orderedCards, oldIndex, newIndex);

    setCardOrderIds(reordered.map((c) => c.id));

    await Promise.all(
      reordered
        .map((card, index) =>
          card.order !== index
            ? updateCard({ params: { id: card.id }, body: { order: index } })
            : null,
        )
        .filter(Boolean),
    );
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Home Page"
        description="Configure the property listing sections and area cards shown on the home page."
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Property Sections</h2>
          <button
            onClick={() => setExpandedSectionId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {sectionsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {orderedSections.length === 0 && expandedSectionId !== "new" && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No sections yet. Add your first one.</p>
              </div>
            )}

            <DndContext collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext
                items={orderedSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {orderedSections.map((section) => (
                    <HomeSectionRow
                      key={section.id}
                      section={section}
                      isExpanded={expandedSectionId === section.id}
                      onToggle={() => handleSectionToggle(section.id)}
                      onSaved={handleSectionSaved}
                      onDeleted={handleSectionDeleted}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {expandedSectionId === "new" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">New Section</p>
                </div>
                <HomeSectionForm
                  section={null}
                  onSaved={handleSectionSaved}
                  onCancel={() => setExpandedSectionId(null)}
                />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Locations</h2>
          <button
            onClick={() => setExpandedCardId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>

        {cardsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {orderedCards.length === 0 && expandedCardId !== "new" && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No locations yet. Add your first one.</p>
              </div>
            )}

            <DndContext collisionDetection={closestCenter} onDragEnd={handleCardDragEnd}>
              <SortableContext
                items={orderedCards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {orderedCards.map((card) => (
                    <HomeAreaCardRow
                      key={card.id}
                      card={card}
                      isExpanded={expandedCardId === card.id}
                      onToggle={() => handleCardToggle(card.id)}
                      onSaved={handleCardSaved}
                      onDeleted={handleCardDeleted}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {expandedCardId === "new" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">New Location</p>
                </div>
                <HomeAreaCardForm
                  card={null}
                  onSaved={handleCardSaved}
                  onCancel={() => setExpandedCardId(null)}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
