import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(1).max(200),
  reason: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000),
});
