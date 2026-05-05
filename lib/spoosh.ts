import { Spoosh } from "@spoosh/core";
import { create } from "@spoosh/react";
import { cachePlugin } from "@spoosh/plugin-cache";
import { deduplicationPlugin } from "@spoosh/plugin-deduplication";
import { invalidationPlugin } from "@spoosh/plugin-invalidation";
import type { AdminReportItem, AdminRequestItem } from "@/types/admin";
import type { Category, Content, MovieListResponse } from "@/types/content";
import type { TmdbMovieImportData } from "@/types/tmdb";
import type {
  CategoryCreateInput,
  CategoryDeleteInput,
  CategoryOrderInput,
  CategoryUpdateInput,
} from "@/validation/categoriesSchema";
import type {
  MovieCreateInput,
  MovieUpdateInput,
} from "@/validation/moviesSchema";
import type { TmdbMovieImportInput } from "@/validation/tmdbSchema";

export type ApiSchema = {
  movies: {
    GET: {
      data: MovieListResponse;
      query?: {
        category?: string;
        page?: number;
        pageSize?: number;
        search?: string;
      };
    };
    POST: {
      data: Content;
      body: MovieCreateInput;
    };
  };
  "movies/:id": {
    GET: {
      data: Content;
      params: {
        id: string;
      };
    };
    PUT: {
      data: Content;
      params: {
        id: string;
      };
      body: MovieUpdateInput;
    };
  };
  categories: {
    GET: {
      data: Category[];
    };
    POST: {
      data: Category;
      body: CategoryCreateInput;
    };
  };
  "categories/:id": {
    PUT: {
      data: Category;
      params: {
        id: string;
      };
      body: CategoryUpdateInput;
    };
    DELETE: {
      data: { ok: true };
      params: {
        id: string;
      };
      body: CategoryDeleteInput;
    };
  };
  "categories/order": {
    PATCH: {
      data: { ok: true };
      body: CategoryOrderInput;
    };
  };
  requests: {
    GET: {
      data: AdminRequestItem[];
    };
    POST: {
      data: { ok: true };
      body: {
        title: string;
      };
    };
  };
  reports: {
    GET: {
      data: AdminReportItem[];
    };
    POST: {
      data: { ok: true };
      body: {
        title: string;
        reason: string;
        description: string;
      };
    };
  };
  "tmdb/movie": {
    POST: {
      data: TmdbMovieImportData;
      body: TmdbMovieImportInput;
    };
  };
};

const spoosh = new Spoosh<ApiSchema, Error>("/api").use([
  cachePlugin({ staleTime: 30000 }),
  deduplicationPlugin(),
  invalidationPlugin(),
]);

export const { useRead, useWrite } = create(spoosh);
