import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import type { AppEnv } from "@/hono/types";

const provincesRoutes = new Hono<AppEnv>();

provincesRoutes.use("*", authMiddleware, adminMiddleware);

provincesRoutes.get("/", async (c) => {
  const provinces = await prisma.province.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return c.json({ provinces });
});

export default provincesRoutes;
