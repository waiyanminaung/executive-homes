import { z } from "zod";

export const propertyTypeCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

export const propertyTypeUpdateSchema = propertyTypeCreateSchema.partial();

export type PropertyTypeCreateInput = z.infer<typeof propertyTypeCreateSchema>;
export type PropertyTypeUpdateInput = z.infer<typeof propertyTypeUpdateSchema>;
