import { createClient } from "@spoosh/core";
import { Hono } from "hono";
import {
  MINUTES_PER_HOUR,
  TMDB_API_BASE_URL,
  TMDB_BACKDROP_SIZE,
  TMDB_IMAGE_BASE_URL,
  TMDB_LANGUAGE,
  TMDB_POSTER_SIZE,
  TMDB_RATING_PRECISION_MULTIPLIER,
} from "@/constants/tmdb";
import { authMiddleware } from "../middleware";
import { zv } from "@/validation/zv";
import {
  tmdbMovieImportSchema,
  tmdbMovieResponseSchema,
  type TmdbMovieResponse,
} from "@/validation/tmdbSchema";
import type { TmdbMovieImportData } from "@/types/tmdb";

interface TmdbErrorResponse {
  status_message?: string;
}

interface TmdbApiSchema {
  "movie/:id": {
    GET: {
      data: TmdbMovieResponse;
      params: {
        id: string;
      };
      query: {
        language: string;
        api_key?: string;
      };
    };
  };
}

const buildImageUrl = (path: string | null | undefined, size: string) => {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

const formatRuntime = (minutes: number | null | undefined) => {
  if (!minutes) return "";

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainingMinutes = minutes % MINUTES_PER_HOUR;

  if (!hours) return `${remainingMinutes}m`;
  if (!remainingMinutes) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
};

const getReleaseYear = (releaseDate: string | null | undefined) => {
  const year = Number(releaseDate?.slice(0, 4));
  if (Number.isFinite(year)) return year;

  return new Date().getFullYear();
};

const mapTmdbMovie = (movie: TmdbMovieResponse): TmdbMovieImportData => {
  return {
    title: movie.title,
    type: "movie",
    year: getReleaseYear(movie.release_date),
    rating:
      Math.round(
        (movie.vote_average ?? 0) * TMDB_RATING_PRECISION_MULTIPLIER,
      ) / TMDB_RATING_PRECISION_MULTIPLIER,
    duration: formatRuntime(movie.runtime),
    genre: movie.genres?.map((genre) => genre.name).join(", ") ?? "",
    description: movie.overview ?? "",
    posterUrl: buildImageUrl(movie.poster_path, TMDB_POSTER_SIZE),
    backdropUrl: buildImageUrl(movie.backdrop_path, TMDB_BACKDROP_SIZE),
  };
};

export const tmdbRoutes = new Hono()
  .use(authMiddleware)
  .post("/movie", zv("json", tmdbMovieImportSchema), async (c) => {
    const { movieId } = c.req.valid("json");
    const accessToken =
      process.env.TMDB_ACCESS_TOKEN ?? process.env.THEMOVIEDB_ACCESS_TOKEN;
    const apiKey = process.env.TMDB_API_KEY ?? process.env.THEMOVIEDB_API_KEY;

    if (!accessToken && !apiKey) {
      return c.json({ error: "TMDB credentials are not configured" }, 500);
    }

    const tmdb = createClient<TmdbApiSchema, TmdbErrorResponse>(
      TMDB_API_BASE_URL,
      accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined,
    );

    const response = await tmdb("movie/:id").GET({
      params: { id: movieId },
      query: {
        language: TMDB_LANGUAGE,
        api_key: accessToken ? undefined : apiKey,
      },
    });

    if (response.error) {
      return c.json(
        {
          error:
            response.error.status_message ??
            "Unable to import movie from TMDB",
        },
        502,
      );
    }

    const parsed = tmdbMovieResponseSchema.safeParse(response.data);

    if (!parsed.success) {
      return c.json({ error: "TMDB returned an unexpected response" }, 502);
    }

    return c.json(mapTmdbMovie(parsed.data));
  });
