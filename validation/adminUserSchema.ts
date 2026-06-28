import { z } from "zod";
import { USER_ROLES } from "@/constants/auth";

const ROLE_VALUES = [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN] as const;

export const createAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLE_VALUES),
});

export type AdminUserCreateInput = z.infer<typeof createAdminUserSchema>;

export const updateAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(ROLE_VALUES).optional(),
});

export type AdminUserUpdateInput = z.infer<typeof updateAdminUserSchema>;
