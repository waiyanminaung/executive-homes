import { z } from "zod";

export const LISTING_TYPES = ["RENT", "SALE", "BOTH"] as const;

export const homeSectionCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  propertyTypeId: z.string().nullable().optional().transform((v) => v || null),
  listingType: z.enum(LISTING_TYPES),
  onlyFeatured: z.boolean(),
  provinceId: z.string().nullable().optional().transform((v) => v || null),
  districtId: z.string().nullable().optional().transform((v) => v || null),
  limit: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1).max(50)),
  order: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(0)),
});

export type HomeSectionCreateInput = z.input<typeof homeSectionCreateSchema>;
export type HomeSectionCreateOutput = z.output<typeof homeSectionCreateSchema>;

export const homeSectionUpdateSchema = homeSectionCreateSchema.partial();
export type HomeSectionUpdateInput = z.input<typeof homeSectionUpdateSchema>;
