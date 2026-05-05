import { Role } from "@/prisma/generated/prisma/client";
import { createMiddleware } from "hono/factory";

interface SessionUserWithRole {
  role?: string;
}

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== Role.ADMIN) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
