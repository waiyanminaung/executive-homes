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
  telegramUrl: "",
  embedUrl: "",
  categoryIds: [],
  isTrending: false,
  isPopular: false,
};
