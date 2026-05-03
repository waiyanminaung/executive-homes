import { Spoosh } from "@spoosh/core";
import { create } from "@spoosh/react";
import { cachePlugin } from "@spoosh/plugin-cache";
import { deduplicationPlugin } from "@spoosh/plugin-deduplication";
import { invalidationPlugin } from "@spoosh/plugin-invalidation";
import type { AdminReportItem, AdminRequestItem } from "@/types/admin";
import type { Category, Content, MovieListResponse } from "@/types/content";
import type { MovieCreateInput } from "@/validation/moviesSchema";

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
  };
  categories: {
    GET: {
      data: Category[];
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
};

const spoosh = new Spoosh<ApiSchema, Error>("/api").use([
  cachePlugin({ staleTime: 30000 }),
  deduplicationPlugin(),
  invalidationPlugin(),
]);

export const { useRead, useWrite } = create(spoosh);
