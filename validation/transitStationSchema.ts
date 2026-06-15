import { z } from "zod";

export const TRANSIT_LINES = [
  "BTS_SUKHUMVIT",
  "BTS_SILOM",
  "MRT_BLUE",
  "MRT_PURPLE",
  "ARL",
  "BRT",
] as const;

export const transitStationCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  line: z.enum(TRANSIT_LINES),
});

export type TransitStationCreateInput = z.infer<typeof transitStationCreateSchema>;

export const transitStationUpdateSchema = transitStationCreateSchema.partial();
export type TransitStationUpdateInput = z.infer<typeof transitStationUpdateSchema>;
