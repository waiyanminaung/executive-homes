import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import type { AppEnv } from "@/hono/types";

const transitStationsRoutes = new Hono<AppEnv>();

transitStationsRoutes.use("*", authMiddleware, adminMiddleware);

transitStationsRoutes.get("/", async (c) => {
  const stations = await prisma.transitStation.findMany({
    orderBy: [{ line: "asc" }, { name: "asc" }],
  });
  return c.json({ stations });
});

export default transitStationsRoutes;
