import { z } from "zod";
import { CATEGORY_NAME_MAX_LENGTH } from "@/constants/adminCategories";

export const categoryIdParamSchema = z.object({
  id: z.string().min(1),
});

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(CATEGORY_NAME_MAX_LENGTH),
  orderIndex: z.coerce.number().int().min(0),
});

export const categoryUpdateSchema = categoryCreateSchema;

export const categoryOrderSchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.string().min(1),
        orderIndex: z.coerce.number().int().min(0),
      }),
    )
    .min(1),
});

export const categoryDeleteSchema = z.object({
  replacementCategoryId: z.string().min(1).nullable().optional(),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CategoryOrderInput = z.infer<typeof categoryOrderSchema>;
export type CategoryDeleteInput = z.infer<typeof categoryDeleteSchema>;
