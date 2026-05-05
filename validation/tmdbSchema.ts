import { z } from "zod";

export const tmdbMovieImportSchema = z.object({
  movieId: z.coerce.number().int().positive(),
});

export const tmdbMovieResponseSchema = z.object({
  title: z.string(),
  release_date: z.string().nullable().optional(),
  vote_average: z.number().nullable().optional(),
  runtime: z.number().nullable().optional(),
  overview: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  genres: z.array(z.object({ name: z.string() })).optional(),
});

export type TmdbMovieImportInput = z.infer<typeof tmdbMovieImportSchema>;
export type TmdbMovieResponse = z.infer<typeof tmdbMovieResponseSchema>;
