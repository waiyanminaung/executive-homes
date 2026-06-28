import { createMiddleware } from "hono/factory";

interface SessionUserWithRole {
  role?: string;
}

export const superAdminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== "SUPERADMIN") {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
