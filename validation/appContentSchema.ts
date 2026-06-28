import { z } from "zod";

export const appContentSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  value: z.string(),
});

export type AppContentInput = z.infer<typeof appContentSchema>;
