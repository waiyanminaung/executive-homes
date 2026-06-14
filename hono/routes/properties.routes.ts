import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyListQuerySchema,
} from "@/validation/propertySchema";
import type { AppEnv } from "@/hono/types";

const propertyRoutes = new Hono<AppEnv>();

propertyRoutes.use("*", authMiddleware, adminMiddleware);

propertyRoutes.get("/", zv("query", propertyListQuerySchema), async (c) => {
  const { page, limit } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        propertyType: true,
        status: true,
        salePrice: true,
        rentPrice: true,
        beds: true,
        baths: true,
        areaSqm: true,
        isFeatured: true,
        isPublished: true,
        createdAt: true,
      },
    }),
    prisma.property.count(),
  ]);

  return c.json({ properties, total, page, limit });
});

propertyRoutes.post("/", zv("json", propertyCreateSchema), async (c) => {
  const { imageUrls, ...data } = c.req.valid("json");

  const property = await prisma.property.create({
    data: {
      ...data,
      images: {
        create: imageUrls.map((url, order) => ({ url, order })),
      },
    },
    include: { images: true },
  });

  return c.json({ property }, 201);
});

propertyRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) {
    return c.json({ error: "Property not found" }, 404);
  }

  return c.json({ property });
});

propertyRoutes.patch("/:id", zv("json", propertyUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const { imageUrls, ...data } = c.req.valid("json");

  const existing = await prisma.property.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ error: "Property not found" }, 404);
  }

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      ...(imageUrls !== undefined && {
        images: {
          deleteMany: {},
          create: imageUrls.map((url, order) => ({ url, order })),
        },
      }),
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return c.json({ property });
});

propertyRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.property.findUnique({ where: { id } });

  if (!existing) {
    return c.json({ error: "Property not found" }, 404);
  }

  await prisma.property.delete({ where: { id } });

  return c.json({ ok: true });
});

export default propertyRoutes;
