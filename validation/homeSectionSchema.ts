import { z } from "zod";

export const LISTING_TYPES = ["RENT", "SALE", "BOTH"] as const;

export const homeSectionCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  propertyTypeId: z.string().nullable().optional(),
  listingType: z.enum(LISTING_TYPES),
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
  limit: z.number().int().min(1).max(50),
  order: z.number().int().min(0),
});

export type HomeSectionCreateInput = z.infer<typeof homeSectionCreateSchema>;

export const homeSectionUpdateSchema = homeSectionCreateSchema.partial();
export type HomeSectionUpdateInput = z.infer<typeof homeSectionUpdateSchema>;
