import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(1).max(200),
  reason: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});

export type ReportInput = z.infer<typeof reportSchema>;
