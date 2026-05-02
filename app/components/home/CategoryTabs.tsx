"use client";

import type { Category } from "@/types/content";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface CategoryTabsProps {
  categories: Category[];
  currentCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export const HomeCategoryTabs = ({
  categories,
  currentCategoryId,
  onSelect,
}: CategoryTabsProps) => {
  return (
    <div
      className={classNames(
        "flex gap-2 lg:gap-3 py-6 lg:py-8 overflow-x-auto no-scrollbar",
        "border-b border-white/5 max-w-4xl mx-auto",
      )}
    >
      <Button
        type="button"
        onClick={() => onSelect("all")}
        className={classNames(
          "px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-[11px] lg:text-[13px]",
          "font-bold uppercase tracking-widest whitespace-nowrap transition-all active:scale-95",
          currentCategoryId === "all"
            ? "bg-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]"
            : "bg-card text-ink-secondary hover:text-white hover:bg-white/5",
        )}
      >
        အားလုံး
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={classNames(
            "px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-[11px] lg:text-[13px]",
            "font-bold uppercase tracking-widest whitespace-nowrap transition-all active:scale-95",
            currentCategoryId === category.id
              ? "bg-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]"
              : "bg-card text-ink-secondary hover:text-white hover:bg-white/5",
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
