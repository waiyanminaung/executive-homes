import { z } from "zod";

export const FEATURE_CATEGORIES = ["UNIT_FEATURE", "AMENITY"] as const;

export const featureCreateSchema = z.object({
  label: z.string().min(1, "Label is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: z.enum(FEATURE_CATEGORIES),
});

export type FeatureCreateInput = z.infer<typeof featureCreateSchema>;

export const featureUpdateSchema = featureCreateSchema.partial();
export type FeatureUpdateInput = z.infer<typeof featureUpdateSchema>;
