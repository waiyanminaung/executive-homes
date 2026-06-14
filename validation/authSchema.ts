import { ADMIN_MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const adminRegisterSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(
        ADMIN_MIN_PASSWORD_LENGTH,
        `Password must be at least ${ADMIN_MIN_PASSWORD_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;
