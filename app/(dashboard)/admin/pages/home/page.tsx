"use client";

import { useState } from "react";
import { type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useRead, useWrite } from "@/lib/spoosh";
import type { HomeSection } from "@/types/homeSection";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import AdminPageHeader from "../../components/AdminPageHeader";
import HomeSectionRow from "./components/HomeSectionRow";
import HomeSectionForm from "./components/HomeSectionForm";
import HomeAreaCardRow from "./components/HomeAreaCardRow";
import HomeAreaCardForm from "./components/HomeAreaCardForm";
import HomePageSection from "./components/HomePageSection";

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

      <HomePageSection
        title="Property Sections"
        addLabel="Add Section"
        newFormLabel="New Section"
        loading={sectionsLoading}
        items={orderedSections}
        expandedId={expandedSectionId}
        emptyMessage="No sections yet. Add your first one."
        onAdd={() => setExpandedSectionId("new")}
        onDragEnd={handleSectionDragEnd}
        renderRow={(section) => (
          <HomeSectionRow
            key={section.id}
            section={section}
            isExpanded={expandedSectionId === section.id}
            onToggle={() => setExpandedSectionId((prev) => (prev === section.id ? null : section.id))}
            onSaved={handleSectionSaved}
            onDeleted={handleSectionDeleted}
          />
        )}
        renderNewForm={() => (
          <HomeSectionForm
            section={null}
            onSaved={handleSectionSaved}
            onCancel={() => setExpandedSectionId(null)}
          />
        )}
      />

      <HomePageSection
        title="Locations"
        addLabel="Add Location"
        newFormLabel="New Location"
        loading={cardsLoading}
        items={orderedCards}
        expandedId={expandedCardId}
        emptyMessage="No locations yet. Add your first one."
        onAdd={() => setExpandedCardId("new")}
        onDragEnd={handleCardDragEnd}
        renderRow={(card) => (
          <HomeAreaCardRow
            key={card.id}
            card={card}
            isExpanded={expandedCardId === card.id}
            onToggle={() => setExpandedCardId((prev) => (prev === card.id ? null : card.id))}
            onSaved={handleCardSaved}
            onDeleted={handleCardDeleted}
          />
        )}
        renderNewForm={() => (
          <HomeAreaCardForm
            card={null}
            onSaved={handleCardSaved}
            onCancel={() => setExpandedCardId(null)}
          />
        )}
      />
    </div>
  );
}
