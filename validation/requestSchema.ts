import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().min(1).max(200),
});
