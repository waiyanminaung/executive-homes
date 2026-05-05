"use client";

import { Button, Dialog } from "@geckoui/geckoui";
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from "lucide-react";
import { useRead } from "@/lib/spoosh";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category, MovieListResponse } from "@/types/content";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminCategoryModal from "./components/AdminCategoryModal";
import AdminDeleteCategoryModal from "./components/AdminDeleteCategoryModal";

export default function AdminCategoriesPage() {
  const categoriesRequest = useRead((api) => api("categories").GET(), {
    staleTime: 60000,
  });
  const moviesRequest = useRead((api) =>
    api("movies").GET({
      query: { page: 1, pageSize: 1000 },
    }),
  );
  const updateOrder = useWrite((api) => api("categories/order").PATCH());

  const categories = (categoriesRequest.data ?? []) as Category[];
  const movies = (moviesRequest.data ?? {
    items: [],
    total: 0,
  }) as MovieListResponse;

  const refreshData = () => {
    categoriesRequest.trigger();
    moviesRequest.trigger();
  };

  const openCategoryModal = (category?: Category) => {
    Dialog.show({
      className: "w-full max-w-md bg-transparent p-0 shadow-none",
      dismissOnOutsideClick: false,
      content: ({ dismiss }) => (
        <AdminCategoryModal
          category={category}
          orderIndex={categories.length}
          onClose={dismiss}
          onSaved={refreshData}
        />
      ),
    });
  };

  const openDeleteModal = (category: Category) => {
    Dialog.show({
      className: "w-full max-w-sm bg-transparent p-0 shadow-none",
      dismissOnOutsideClick: false,
      content: ({ dismiss }) => (
        <AdminDeleteCategoryModal
          categories={categories}
          category={category}
          onClose={dismiss}
          onDeleted={refreshData}
        />
      ),
    });
  };

  const moveCategory = async (categoryId: string, direction: "up" | "down") => {
    const currentIndex = categories.findIndex(
      (category) => category.id === categoryId,
    );

    if (currentIndex < 0) return;

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex >= categories.length) return;

    const orderedCategories = [...categories];
    const currentCategory = orderedCategories[currentIndex];
    const nextCategory = orderedCategories[nextIndex];

    if (!currentCategory || !nextCategory) return;

    orderedCategories[currentIndex] = nextCategory;
    orderedCategories[nextIndex] = currentCategory;

    const result = await updateOrder.trigger({
      body: {
        categories: orderedCategories.map((category, index) => ({
          id: category.id,
          orderIndex: index,
        })),
      },
    });

    if (result.error) return;

    refreshData();
  };

  return (
    <div className={classNames("space-y-8")}>
      <AdminPageHeader
        eyebrow="Taxonomy"
        title="Menu Categories"
        description="Review the current category order and how much content is attached to each group."
        actions={
          <Button
            type="button"
            onClick={() => openCategoryModal()}
            className={classNames(
              "flex items-center gap-2 rounded-xl bg-white px-6 py-3",
              "text-[10px] font-black uppercase tracking-widest text-black",
              "transition-all hover:scale-105 hover:bg-white/90 active:scale-95",
            )}
          >
            <Plus className="size-4" />
            မီနူးအသစ်
          </Button>
        }
      />

      <section
        className={classNames(
          "overflow-hidden rounded-3xl border border-white/5 bg-[#111] p-4",
          "shadow-2xl lg:rounded-[2.5rem] lg:p-8",
        )}
      >
        {categories.length === 0 ? (
          <div
            className={classNames(
              "rounded-3xl border-2 border-dashed border-white/5 py-20 text-center",
              "text-xs font-black uppercase tracking-widest text-white/10",
            )}
          >
            မီနူးများ မရှိသေးပါ
          </div>
        ) : (
          <div className={classNames("grid gap-4")}>
            {categories.map((category) => {
              const usageCount = movies.items.filter((movie) =>
                movie.categoryIds.includes(category.id),
              ).length;
              const categoryIndex = categories.findIndex(
                (item) => item.id === category.id,
              );

              return (
                <div
                  key={category.id}
                  className={classNames(
                    "flex flex-col gap-4 rounded-2xl border sm:flex-row",
                    "sm:items-center sm:justify-between",
                    "border-white/5 bg-white/5 p-5 transition-all hover:bg-white/[0.07]",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid gap-2">
                      <Button
                        type="button"
                        variant="icon"
                        disabled={categoryIndex === 0 || updateOrder.loading}
                        onClick={() => moveCategory(category.id, "up")}
                        className={classNames(
                          "!size-9 shrink-0 rounded-lg bg-white/5 text-white/35",
                          "hover:bg-white/10 hover:text-white disabled:opacity-20",
                        )}
                      >
                        <ArrowUp className="size-4 shrink-0" />
                      </Button>
                      <Button
                        type="button"
                        variant="icon"
                        disabled={
                          categoryIndex === categories.length - 1 ||
                          updateOrder.loading
                        }
                        onClick={() => moveCategory(category.id, "down")}
                        className={classNames(
                          "!size-9 shrink-0 rounded-lg bg-white/5 text-white/35",
                          "hover:bg-white/10 hover:text-white disabled:opacity-20",
                        )}
                      >
                        <ArrowDown className="size-4 shrink-0" />
                      </Button>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p
                        className={classNames(
                          "mt-1 text-[10px] font-bold uppercase tracking-widest",
                          "text-white/30",
                        )}
                      >
                        Order Index: {category.orderIndex}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="rounded-xl bg-white/5 px-4 py-3 text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
                        Linked
                      </p>
                      <p className="text-sm font-black text-white">
                        {usageCount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="icon"
                        onClick={() => openCategoryModal(category)}
                        className={classNames(
                          "!size-12 shrink-0 rounded-xl bg-white/5 text-white/50",
                          "transition-all hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <Edit className="size-4 shrink-0" />
                      </Button>
                      <Button
                        type="button"
                        variant="icon"
                        onClick={() => openDeleteModal(category)}
                        className={classNames(
                          "!size-12 shrink-0 rounded-xl bg-red-500/10 text-red-500",
                          "transition-all hover:bg-red-500/20",
                        )}
                      >
                        <Trash2 className="size-4 shrink-0" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
