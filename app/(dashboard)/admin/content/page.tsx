"use client";

import { useState } from "react";
import { Button, Dialog, Input, Select, SelectOption } from "@geckoui/geckoui";
import { PAGE_SIZE } from "@/constants/content";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category, Content, MovieListResponse } from "@/types/content";
import AdminContentModal from "./components/AdminContentModal";
import AdminContentListItem from "./components/AdminContentListItem";
import AdminContentPagination from "./components/AdminContentPagination";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminContentPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>("all");
  const [page, setPage] = useState(1);

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

  const openContentModal = (content?: Content) => {
    Dialog.show({
      className: "w-full max-w-2xl bg-transparent p-0 shadow-none",
      dismissOnOutsideClick: false,
      content: ({ dismiss }) => (
        <AdminContentModal
          categories={categories}
          content={content}
          onClose={dismiss}
        />
      ),
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Library"
        title="Library Management"
        description="Search the real content store, filter by menu category and inspect what is already live on the site."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={classNames(
                "rounded-2xl border border-white/5 bg-white/5 px-4 py-3",
                "text-sm text-white/45",
              )}
            >
              {categoryLabel}
            </div>
            <Button
              type="button"
              onClick={() => openContentModal()}
              className={classNames(
                "rounded-xl bg-white px-6 py-3 text-[10px] font-black uppercase",
                "tracking-widest text-black transition-all hover:scale-105 hover:bg-white/90",
                "active:scale-95",
              )}
            >
              Create Content
            </Button>
          </div>
        }
      />

      <section
        className={classNames(
          "overflow-hidden rounded-3xl border border-white/5 bg-[#111] shadow-2xl",
          "lg:rounded-[2.5rem]",
        )}
      >
        <div className="border-b border-white/5 p-4 lg:p-8">
          <div
            className={classNames(
              "grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",
            )}
          >
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search titles, genres or IDs..."
              className="rounded-2xl border-white/5 bg-white/5"
              inputClassName="placeholder:text-white/25"
            />
            <Select
              value={category}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              className="rounded-2xl border-white/5 bg-white/5"
            >
              <SelectOption value="all" label="All Categories" />
              {categories.map((item) => (
                <SelectOption key={item.id} value={item.id} label={item.name} />
              ))}
            </Select>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {loading ? (
            <div
              className={classNames(
                "py-20 text-center text-xs font-black uppercase tracking-[0.3em]",
                "text-white/20 animate-pulse",
              )}
            >
              ဒေတာများကို ရယူနေပါသည်...
            </div>
          ) : response.items.length === 0 ? (
            <div
              className={classNames(
                "rounded-3xl border-2 border-dashed border-white/5 py-20",
                "text-center text-xs font-black uppercase tracking-widest text-white/10",
              )}
            >
              ရုပ်ရှင်မရှိသေးပါ
            </div>
          ) : (
            <div className="grid gap-3 lg:gap-4">
              {response.items.map((item) => (
                <AdminContentListItem
                  key={item.id}
                  item={item}
                  onEdit={openContentModal}
                />
              ))}
            </div>
          )}

          {search.trim() ? null : (
            <AdminContentPagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          )}
        </div>
      </section>
    </div>
  );
}
