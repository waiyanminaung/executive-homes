import { z } from "zod";

export const publicPropertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  isForSale: z.coerce.boolean().optional(),
  isForRent: z.coerce.boolean().optional(),
  type: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  beds: z.enum(["0", "1", "2", "3", "4", "5"]).optional(),
  q: z.string().optional(),
  isPetFriendly: z.coerce.boolean().optional(),
  stationIds: z.string().optional(),
  subDistrictIds: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});
