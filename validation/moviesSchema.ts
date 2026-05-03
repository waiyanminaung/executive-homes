import { z } from "zod";

export const movieListQuerySchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
});

export const movieIdParamSchema = z.object({
  id: z.string().min(1),
});

export const movieCreateSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["movie", "series"]),
  year: z.coerce.number().int().min(1888).max(2100),
  rating: z.coerce.number().min(0).max(10),
  duration: z.string().max(50).optional(),
  genre: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  posterUrl: z.string().min(1).max(500),
  backdropUrl: z.string().min(1).max(500),
  telegramUrl: z.string().max(500).optional(),
  embedUrl: z.string().max(500).optional(),
  categoryIds: z.array(z.string().min(1)).default([]),
  isTrending: z.boolean().default(false),
  isPopular: z.boolean().default(false),
});

export type MovieCreateInput = z.infer<typeof movieCreateSchema>;
