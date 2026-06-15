import { z } from "zod";

export const provinceCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
});

export type ProvinceCreateInput = z.infer<typeof provinceCreateSchema>;

export const provinceUpdateSchema = provinceCreateSchema.partial();
export type ProvinceUpdateInput = z.infer<typeof provinceUpdateSchema>;

export const districtCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  provinceId: z.string().min(1, "Province is required"),
});

export type DistrictCreateInput = z.infer<typeof districtCreateSchema>;

export const districtUpdateSchema = districtCreateSchema.partial();
export type DistrictUpdateInput = z.infer<typeof districtUpdateSchema>;
