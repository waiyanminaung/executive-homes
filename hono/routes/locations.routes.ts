import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import {
  provinceCreateSchema,
  provinceUpdateSchema,
  districtCreateSchema,
  districtUpdateSchema,
} from "@/validation/locationSchema";
import type { AppEnv } from "@/hono/types";

const locationsRoutes = new Hono<AppEnv>();

locationsRoutes.use("*", authMiddleware, adminMiddleware);

locationsRoutes.get("/provinces", async (c) => {
  const provinces = await prisma.province.findMany({ orderBy: { name: "asc" } });
  return c.json({ provinces });
});

locationsRoutes.post("/provinces", zv("json", provinceCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const province = await prisma.province.create({ data });
  return c.json({ province }, 201);
});

locationsRoutes.patch("/provinces/:id", zv("json", provinceUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const existing = await prisma.province.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Province not found" }, 404);
  const province = await prisma.province.update({ where: { id }, data });
  return c.json({ province });
});

locationsRoutes.delete("/provinces/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.province.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Province not found" }, 404);
  await prisma.province.delete({ where: { id } });
  return c.json({ ok: true });
});

locationsRoutes.get("/districts", async (c) => {
  const provinceId = c.req.query("provinceId");
  const districts = await prisma.district.findMany({
    where: provinceId ? { provinceId } : undefined,
    orderBy: { name: "asc" },
    include: { province: { select: { id: true, name: true } } },
  });
  return c.json({ districts });
});

locationsRoutes.post("/districts", zv("json", districtCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const district = await prisma.district.create({
    data,
    include: { province: { select: { id: true, name: true } } },
  });
  return c.json({ district }, 201);
});

locationsRoutes.patch("/districts/:id", zv("json", districtUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const existing = await prisma.district.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "District not found" }, 404);
  const district = await prisma.district.update({
    where: { id },
    data,
    include: { province: { select: { id: true, name: true } } },
  });
  return c.json({ district });
});

locationsRoutes.delete("/districts/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.district.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "District not found" }, 404);
  await prisma.district.delete({ where: { id } });
  return c.json({ ok: true });
});

export default locationsRoutes;
