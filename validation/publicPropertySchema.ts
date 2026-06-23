import { z } from "zod";

export const publicPropertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  isForSale: z.coerce.boolean().optional(),
  isForRent: z.coerce.boolean().optional(),
  type: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  beds: z.coerce.number().int().optional(),
  q: z.string().optional(),
});
