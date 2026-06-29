import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { featureCreateSchema, featureUpdateSchema } from "@/validation/featureSchema";
import type { AppEnv } from "@/hono/types";

const featuresRoutes = new Hono<AppEnv>();

featuresRoutes.use("*", authMiddleware, adminMiddleware);

featuresRoutes.get("/", async (c) => {
  const features = await prisma.feature.findMany({
    orderBy: [{ category: "asc" }, { label: "asc" }],
  });
  return c.json({ features });
});

featuresRoutes.post("/", zv("json", featureCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const feature = await prisma.feature.create({ data });
  return c.json({ feature }, 201);
});

featuresRoutes.patch("/:id", zv("json", featureUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const existing = await prisma.feature.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Feature not found" }, 404);

  const feature = await prisma.feature.update({ where: { id }, data });
  return c.json({ feature });
});

const bulkIdsSchema = z.object({ ids: z.array(z.string()).min(1) });

featuresRoutes.delete("/bulk", zv("json", bulkIdsSchema), async (c) => {
  const { ids } = c.req.valid("json");

  try {
    const result = await prisma.feature.deleteMany({ where: { id: { in: ids } } });
    return c.json({ ok: true, deleted: result.count });
  } catch {
    return c.json({ error: "Failed to delete features" }, 500);
  }
});

featuresRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.feature.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Feature not found" }, 404);

  await prisma.feature.delete({ where: { id } });
  return c.json({ ok: true });
});

export default featuresRoutes;
