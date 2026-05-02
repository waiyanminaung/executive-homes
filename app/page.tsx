"use client";

import { useEffect, useState } from "react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { PAGE_SIZE } from "@/constants/content";
import { useRead } from "@/lib/spoosh";
import { useWatchlist } from "@/components/@shared/useWatchlist";
import type { Category, MovieListResponse } from "@/types/content";
import {
  HomeCategoryTabs,
  HomeNav,
  HomePagination,
  HomeSearchBar,
  MovieGrid,
  RequestModal,
  WatchlistButton,
  WatchlistModal,
} from "./components/home";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { watchlist, remove, clear } = useWatchlist();

  const { data: categoriesData } = useRead((api) => api("categories").GET(), {
    staleTime: 60000,
  });

  const { data: moviesData, loading } = useRead((api) =>
    api("movies").GET({
      query: {
        category: currentCategoryId,
        page: searchQuery.trim() ? 1 : currentPage,
        pageSize: PAGE_SIZE,
        search: searchQuery.trim() ? searchQuery : undefined,
      },
    }),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, currentCategoryId]);

  const categories = categoriesData ?? ([] as Category[]);
  const response = moviesData ?? ({ items: [], total: 0 } as MovieListResponse);
  const totalPages = Math.max(1, Math.ceil(response.total / PAGE_SIZE));

  return (
    <div
      className={classNames(
        "min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-accent/30",
      )}
    >
      <HomeNav onRequestClick={() => setIsRequestOpen(true)} />

      <div className={classNames("pt-20")}>
        <main
          className={classNames("relative z-10 pb-24 px-4 overflow-x-hidden")}
        >
          <HomeSearchBar value={searchQuery} onChange={setSearchQuery} />

          {!searchQuery.trim() ? (
            <HomeCategoryTabs
              categories={categories}
              currentCategoryId={currentCategoryId}
              onSelect={(categoryId) => setCurrentCategoryId(categoryId)}
            />
          ) : null}

          <section className={classNames("mt-8")}>
            {searchQuery.trim() ? (
              <div
                className={classNames("mb-6 flex items-center justify-between")}
              >
                <h2
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
                  )}
                >
                  ရှာဖွေမှု ရလဒ်များ
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-widest text-accent",
                    "hover:underline",
                  )}
                >
                  ရှင်းပါ
                </Button>
              </div>
            ) : null}

            <MovieGrid
              items={response.items}
              isLoading={loading}
              isSearchActive={!!searchQuery.trim()}
            />

            {!searchQuery.trim() ? (
              <HomePagination
                currentPage={currentPage}
                totalPages={totalPages}
                isLoading={loading}
                onChange={setCurrentPage}
              />
            ) : null}
          </section>
        </main>
      </div>

      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
      <WatchlistModal
        isOpen={isWatchlistOpen}
        items={watchlist}
        onClose={() => setIsWatchlistOpen(false)}
        onRemove={remove}
        onClear={clear}
      />
      <WatchlistButton
        count={watchlist.length}
        onClick={() => setIsWatchlistOpen(true)}
      />
    </div>
  );
}
