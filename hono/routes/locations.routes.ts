import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import {
  provinceCreateSchema,
  provinceUpdateSchema,
  districtCreateSchema,
  districtUpdateSchema,
  subDistrictCreateSchema,
  subDistrictUpdateSchema,
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

locationsRoutes.get("/subdistricts", async (c) => {
  const districtId = c.req.query("districtId");
  const subDistricts = await prisma.subDistrict.findMany({
    where: districtId ? { districtId } : undefined,
    orderBy: { name: "asc" },
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistricts });
});

locationsRoutes.post("/subdistricts", zv("json", subDistrictCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const subDistrict = await prisma.subDistrict.create({
    data,
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistrict }, 201);
});

locationsRoutes.patch("/subdistricts/:id", zv("json", subDistrictUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const existing = await prisma.subDistrict.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "SubDistrict not found" }, 404);
  const subDistrict = await prisma.subDistrict.update({
    where: { id },
    data,
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistrict });
});

locationsRoutes.delete("/subdistricts/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.subDistrict.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "SubDistrict not found" }, 404);
  await prisma.subDistrict.delete({ where: { id } });
  return c.json({ ok: true });
});

export default locationsRoutes;
