import { z } from "zod";

export const homeAreaCardCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageKey: z.string().min(1, "Image is required"),
  order: z.number().int().min(0),
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
});

export type HomeAreaCardCreateInput = z.infer<typeof homeAreaCardCreateSchema>;

export const homeAreaCardUpdateSchema = homeAreaCardCreateSchema.partial();
export type HomeAreaCardUpdateInput = z.infer<typeof homeAreaCardUpdateSchema>;

export const homeAreaCardFormSchema = z.object({
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
});

export type HomeAreaCardFormValues = z.infer<typeof homeAreaCardFormSchema>;
