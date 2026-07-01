import { z } from "zod";

export const aboutStatSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
});

export const aboutContentSchema = z.object({
  heroImage: z.string(),
  introTagline: z.string().min(1, "Required"),
  introHeading: z.string().min(1, "Required"),
  introContent: z.string().min(1, "Required"),
  introImage: z.string(),
  stats: z.array(aboutStatSchema).min(1, "At least one stat required"),
});

export type AboutContentInput = z.infer<typeof aboutContentSchema>;
