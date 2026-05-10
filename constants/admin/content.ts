import type { MovieCreateInput } from "@/validation/moviesSchema";

export const DEFAULT_ADMIN_CONTENT_VALUES: MovieCreateInput = {
  title: "",
  type: "movie",
  year: new Date().getFullYear(),
  rating: 0,
  duration: "",
  genre: "",
  description: "",
  posterUrl: "",
  backdropUrl: "",
  width: 1280,
  height: 720,
  telegramUrl: "",
  sourceUrl: "",
  provider: "S3",
  categoryIds: [],
  isTrending: false,
  isPopular: false,
};
