import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { homeSectionCreateSchema, homeSectionUpdateSchema } from "@/validation/homeSectionSchema";
import type { AppEnv } from "@/hono/types";

const homeSectionsRoutes = new Hono<AppEnv>();

homeSectionsRoutes.use("*", authMiddleware, adminMiddleware);

const INCLUDE = {
  propertyType: { select: { id: true, name: true, slug: true } },
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
} as const;

homeSectionsRoutes.get("/", async (c) => {
  const sections = await prisma.homeSection.findMany({
    orderBy: { order: "asc" },
    include: INCLUDE,
  });
  return c.json({ sections });
});

homeSectionsRoutes.post("/", zv("json", homeSectionCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const section = await prisma.homeSection.create({ data, include: INCLUDE });
  return c.json({ section }, 201);
});

homeSectionsRoutes.patch("/:id", zv("json", homeSectionUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const existing = await prisma.homeSection.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Section not found" }, 404);

  const section = await prisma.homeSection.update({ where: { id }, data, include: INCLUDE });
  return c.json({ section });
});

homeSectionsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.homeSection.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Section not found" }, 404);

  await prisma.homeSection.delete({ where: { id } });
  return c.json({ ok: true });
});

export default homeSectionsRoutes;
