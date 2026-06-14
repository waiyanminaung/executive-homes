import { createMiddleware } from "hono/factory";

interface SessionUserWithRole {
  role?: string;
}

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== "ADMIN") {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
