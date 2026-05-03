"use client";

import { useRead } from "@/lib/spoosh";
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Taxonomy"
        title="Categories"
        description="Review the current category order and how much content is attached to each group."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30 md:col-span-2 xl:col-span-3">
            No categories available yet.
          </div>
        ) : (
          categories.map((category) => {
            const usageCount = movies.items.filter((movie) =>
              movie.categoryIds.includes(category.id),
            ).length;

            return (
              <div
                key={category.id}
                className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-2xl shadow-black/10"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                  Order {category.orderIndex}
                </p>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-tighter text-white">
                  {category.name}
                </h3>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/45">
                  <span>Linked titles</span>
                  <span className="font-black text-white">{usageCount}</span>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
