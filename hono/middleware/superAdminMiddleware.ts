import { createMiddleware } from "hono/factory";
import { USER_ROLES } from "@/constants/auth";
import type { AuthUser } from "@/hono/types";

export const superAdminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as AuthUser | undefined;

  if (user?.role !== USER_ROLES.SUPERADMIN) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
