import type { ContentSourceProvider } from "@/constants/content";

export interface DownloadLink {
  url: string;
  quality: string;
  size: string;
}

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  duration: string;
  description: string;
  posterUrl: string;
  telegramUrl?: string;
  sourceUrl: string;
  provider: ContentSourceProvider;
  downloadLinks?: DownloadLink[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Category {
  id: string;
  name: string;
  orderIndex: number;
}

export interface Content {
  id: string;
  type: "movie" | "series";
  title: string;
  year: number;
  rating: number;
  duration?: string;
  genre: string[];
  description: string;
  posterUrl: string;
  backdropUrl: string;
  width?: number;
  height?: number;
  telegramUrl?: string;
  sourceUrl: string;
  provider: ContentSourceProvider;
  downloadLinks?: DownloadLink[];
  seasons?: Season[];
  categoryIds: string[];
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface MovieListResponse {
  items: Content[];
  total: number;
}
