import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { propertyTypeCreateSchema, propertyTypeUpdateSchema } from "@/validation/propertyTypeSchema";
import type { AppEnv } from "@/hono/types";

const propertyTypesRoutes = new Hono<AppEnv>();

propertyTypesRoutes.use("*", authMiddleware, adminMiddleware);

propertyTypesRoutes.get("/", async (c) => {
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });
  return c.json({ propertyTypes });
});

propertyTypesRoutes.post("/", zv("json", propertyTypeCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const propertyType = await prisma.propertyType.create({ data });
  return c.json({ propertyType }, 201);
});

propertyTypesRoutes.patch("/:id", zv("json", propertyTypeUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const propertyType = await prisma.propertyType.update({ where: { id }, data });
  return c.json({ propertyType });
});

propertyTypesRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.propertyType.delete({ where: { id } });
  return c.json({ ok: true });
});

export default propertyTypesRoutes;
