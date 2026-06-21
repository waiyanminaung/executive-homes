import { z } from "zod";

export const contactInfoSchema = z.object({
  phone: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  whatsapp: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  facebook: z.string(),
  instagram: z.string(),
  line: z.string(),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
