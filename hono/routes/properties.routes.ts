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

const PROPERTY_INCLUDE = {
  images: { orderBy: { order: "asc" as const } },
  features: { include: { feature: true } },
  transitStations: { include: { station: true } },
  propertyType: { select: { id: true, name: true, slug: true } },
};

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
        id: true, slug: true, title: true,
        isForSale: true, isForRent: true, availabilityStatus: true,
        propertyType: { select: { id: true, name: true, slug: true } },
        salePrice: true, rentPrice: true, beds: true, baths: true, areaSqm: true,
        isFeatured: true, isPublished: true, createdAt: true,
      },
    }),
    prisma.property.count(),
  ]);

  return c.json({ properties, total, page, limit });
});

propertyRoutes.post("/", zv("json", propertyCreateSchema), async (c) => {
  const { imageUrls, featureIds, transitStations, ...data } = c.req.valid("json");

  const property = await prisma.property.create({
    data: {
      ...data,
      images: { create: imageUrls.map((url, order) => ({ url, order })) },
      features: { create: featureIds.map((featureId) => ({ featureId })) },
      transitStations: { create: transitStations },
    },
    include: PROPERTY_INCLUDE,
  });

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  }, 201);
});

propertyRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const property = await prisma.property.findUnique({
    where: { id },
    include: PROPERTY_INCLUDE,
  });

  if (!property) return c.json({ error: "Property not found" }, 404);

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  });
});

propertyRoutes.patch("/:id", zv("json", propertyUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const { imageUrls, featureIds, transitStations, ...data } = c.req.valid("json");

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Property not found" }, 404);

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      ...(imageUrls !== undefined && {
        images: { deleteMany: {}, create: imageUrls.map((url, order) => ({ url, order })) },
      }),
      ...(featureIds !== undefined && {
        features: { deleteMany: {}, create: featureIds.map((featureId) => ({ featureId })) },
      }),
      ...(transitStations !== undefined && {
        transitStations: { deleteMany: {}, create: transitStations },
      }),
    },
    include: PROPERTY_INCLUDE,
  });

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  });
});

propertyRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Property not found" }, 404);
  await prisma.property.delete({ where: { id } });
  return c.json({ ok: true });
});

export default propertyRoutes;
