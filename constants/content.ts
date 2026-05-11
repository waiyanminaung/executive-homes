import type { VideoProvider } from "@/prisma/generated/prisma/enums";

export const PAGE_SIZE = 18;

export const SEARCH_DEBOUNCE_MS = 350;

export const WATCHLIST_STORAGE_KEY = "pkmovie.watchlist";

export const CONTENT_IMAGE_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const CONTENT_SOURCE_PROVIDERS = [
  "VK",
  "S3",
] as const satisfies readonly VideoProvider[];

export type ContentSourceProvider = (typeof CONTENT_SOURCE_PROVIDERS)[number];

export const CONTENT_SOURCE_PROVIDER_OPTIONS = CONTENT_SOURCE_PROVIDERS.map(
  (provider) => ({
    label: provider,
    value: provider,
  }),
);
