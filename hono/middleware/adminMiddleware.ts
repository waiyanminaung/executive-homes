import { createMiddleware } from "hono/factory";
import { USER_ROLES } from "@/constants/auth";

interface SessionUserWithRole {
  role?: string;
}

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== USER_ROLES.ADMIN && user?.role !== USER_ROLES.SUPERADMIN) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
