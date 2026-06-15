import { z } from "zod";

export const publicEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required"),
  propertyId: z.string().optional(),
  listingType: z.string().optional(),
});

export type PublicEnquiryInput = z.infer<typeof publicEnquirySchema>;
