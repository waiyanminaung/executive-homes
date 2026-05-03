"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input, Select, SelectOption } from "@geckoui/geckoui";
import { PAGE_SIZE } from "@/constants/content";
import { useRead } from "@/lib/spoosh";
import type { Category, Content, MovieListResponse } from "@/types/content";
import AdminCreateContentPanel from "./components/AdminCreateContentPanel";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminContentPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>("all");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: categoriesData } = useRead((api) => api("categories").GET(), {
    staleTime: 60000,
  });
  const { data: moviesData, loading } = useRead((api) =>
    api("movies").GET({
      query: {
        category: category ?? undefined,
        page: search.trim() ? 1 : page,
        pageSize: PAGE_SIZE,
        search: search.trim() ? search : undefined,
      },
    }),
  );

  const categories = (categoriesData ?? []) as Category[];
  const response = (moviesData ?? { items: [], total: 0 }) as MovieListResponse;
  const totalPages = Math.max(1, Math.ceil(response.total / PAGE_SIZE));

  const categoryLabel =
    category === "all" || !category
      ? "All Categories"
      : (categories.find((item) => item.id === category)?.name ??
        "Selected Category");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Library"
        title="Content Catalog"
        description="Search the real content store, filter by category and inspect what is already live on the site."
        actions={
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
              {categoryLabel}
            </div>
            <Button
              type="button"
              onClick={() => setIsCreateOpen((current) => !current)}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-black hover:bg-white/90"
            >
              {isCreateOpen ? "Close Create" : "Create Content"}
            </Button>
          </div>
        }
      />

      {isCreateOpen ? (
        <AdminCreateContentPanel
          categories={categories}
          onCreated={() => {
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      ) : null}

      <section className="rounded-3xl border border-white/5 bg-white/[0.03] p-4 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search titles, genres or IDs..."
            className="bg-white/5 border-white/10"
            inputClassName="placeholder:text-white/25"
          />
          <Select
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            className="bg-white/5"
          >
            <SelectOption value="all" label="All Categories" />
            {categories.map((item) => (
              <SelectOption key={item.id} value={item.id} label={item.name} />
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
            Loading content...
          </div>
        ) : response.items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
            No content matched the current filter.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {response.items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {search.trim() ? null : (
          <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] px-4 py-4 text-sm text-white/40">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-full border border-white/10 px-4 py-2 font-bold text-white/60 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages}
                className="rounded-full border border-white/10 px-4 py-2 font-bold text-white/60 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ContentCard({ item }: { item: Content }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/5 bg-[#111] shadow-2xl shadow-black/10">
      <div className="aspect-[16/10] overflow-hidden bg-black/30">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-white/40">
              {item.genre.join(" · ")}
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/50">
            {item.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-white/45">
          <div className="rounded-2xl bg-white/5 px-3 py-2">
            Year {item.year}
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-2">
            Rating {item.rating}
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-2">
            {item.duration ?? "No duration"}
          </div>
          <div className="rounded-2xl bg-white/5 px-3 py-2">
            {item.categoryIds.length} categories
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-white/45">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.isTrending ? (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent">
              Trending
            </span>
          ) : null}
          {item.isPopular ? (
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/70">
              Popular
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/movie/${item.id}`}
            className="text-sm font-bold text-accent hover:underline"
          >
            Open public page
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            {item.categoryIds.length} tags
          </span>
        </div>
      </div>
    </article>
  );
}
