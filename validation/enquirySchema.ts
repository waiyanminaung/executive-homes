import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
