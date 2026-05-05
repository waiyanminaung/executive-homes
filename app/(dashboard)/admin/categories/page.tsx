"use client";

import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category, MovieListResponse } from "@/types/content";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminCategoriesPage() {
  const { data: categoriesData } = useRead((api) => api("categories").GET(), {
    staleTime: 60000,
  });
  const { data: moviesData } = useRead((api) =>
    api("movies").GET({
      query: { page: 1, pageSize: 1000 },
    }),
  );

  const categories = (categoriesData ?? []) as Category[];
  const movies = (moviesData ?? { items: [], total: 0 }) as MovieListResponse;

  return (
    <div className={classNames("space-y-8")}>
      <AdminPageHeader
        eyebrow="Taxonomy"
        title="Menu Categories"
        description="Review the current category order and how much content is attached to each group."
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

              return (
                <div
                  key={category.id}
                  className={classNames(
                    "flex items-center justify-between gap-4 rounded-2xl border",
                    "border-white/5 bg-white/5 p-5 transition-all hover:bg-white/[0.07]",
                  )}
                >
                  <div>
                    <h3 className="text-xl font-bold text-white">
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
                  <div
                    className={classNames(
                      "rounded-xl bg-white/5 px-4 py-3 text-right",
                    )}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/25">
                      Linked
                    </p>
                    <p className="text-sm font-black text-white">
                      {usageCount}
                    </p>
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
