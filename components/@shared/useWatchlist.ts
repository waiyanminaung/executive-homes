"use client";

import { useEffect, useState } from "react";
import { WATCHLIST_STORAGE_KEY } from "@/constants/content";
import type { Content } from "@/types/content";

const parseWatchlist = (value: string | null): Content[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed as Content[];
  } catch {
    return [];
  }

  return [];
};

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Content[]>([]);

  useEffect(() => {
    const stored = parseWatchlist(localStorage.getItem(WATCHLIST_STORAGE_KEY));
    setWatchlist(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const add = (item: Content) => {
    setWatchlist((prev) => {
      if (prev.find((entry) => entry.id === item.id)) return prev;
      return [item, ...prev];
    });
  };

  const remove = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => {
    setWatchlist([]);
  };

  const toggle = (item: Content) => {
    setWatchlist((prev) => {
      const exists = prev.find((entry) => entry.id === item.id);
      if (exists) return prev.filter((entry) => entry.id !== item.id);
      return [item, ...prev];
    });
  };

  const isSaved = (id: string) => {
    return watchlist.some((item) => item.id === id);
  };

  return {
    watchlist,
    add,
    remove,
    clear,
    toggle,
    isSaved,
  };
};
