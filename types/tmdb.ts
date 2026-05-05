import type { MovieCreateInput } from "@/validation/moviesSchema";

export type TmdbMovieImportData = Pick<
  MovieCreateInput,
  | "title"
  | "type"
  | "year"
  | "rating"
  | "duration"
  | "genre"
  | "description"
  | "posterUrl"
  | "backdropUrl"
>;
