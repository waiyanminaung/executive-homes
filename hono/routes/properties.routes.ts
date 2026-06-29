import { Hono } from "hono";
import { z } from "zod";
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
  pricingTiers: { orderBy: { order: "asc" as const } },
};

const propertyRoutes = new Hono<AppEnv>();

propertyRoutes.use("*", authMiddleware, adminMiddleware);

propertyRoutes.get("/", zv("query", propertyListQuerySchema), async (c) => {
  const { page, limit, search, typeId, status, listingType, availability, provinceId, districtId, subDistrictIds } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    ...(typeId ? { propertyTypeId: typeId } : {}),
    ...(status === "published" ? { isPublished: true } : {}),
    ...(status === "draft" ? { isPublished: false } : {}),
    ...(listingType === "sale" ? { isForSale: true } : {}),
    ...(listingType === "rent" ? { isForRent: true } : {}),
    ...(availability ? { availabilityStatus: availability } : {}),
    ...(provinceId ? { provinceId } : {}),
    ...(districtId ? { districtId } : {}),
    ...(subDistrictIds ? { subDistrictId: { in: subDistrictIds.split(",") } } : {}),
  };

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, slug: true, title: true,
          isForSale: true, isForRent: true, availabilityStatus: true,
          propertyType: { select: { id: true, name: true, slug: true } },
          pricingTiers: { orderBy: { order: "asc" as const } },
          beds: true, baths: true, areaSqm: true,
          isFeatured: true, isPublished: true, isPetFriendly: true, createdAt: true,
        },
      }),
      prisma.property.count({ where }),
    ]);

    return c.json({ properties, total, page, limit });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

propertyRoutes.post("/", zv("json", propertyCreateSchema), async (c) => {
  const { imageUrls, featureIds, transitStations, pricingTiers, ...data } = c.req.valid("json");

  try {
    const property = await prisma.property.create({
      data: {
        ...data,
        images: { create: imageUrls.map((url, order) => ({ url, order })) },
        features: { create: featureIds.map((featureId) => ({ featureId })) },
        transitStations: { create: transitStations },
        pricingTiers: { create: pricingTiers.map((tier, order) => ({ ...tier, order })) },
      },
      include: PROPERTY_INCLUDE,
    });

    return c.json({
      property: {
        ...property,
        features: property.features.map((pf) => pf.feature),
      },
    }, 201);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

propertyRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
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
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

const bulkIdsSchema = z.object({ ids: z.array(z.string()).min(1) });
const bulkPublishSchema = bulkIdsSchema.extend({ isPublished: z.boolean() });

propertyRoutes.patch("/bulk", zv("json", bulkPublishSchema), async (c) => {
  const { ids, isPublished } = c.req.valid("json");

  try {
    const result = await prisma.property.updateMany({ where: { id: { in: ids } }, data: { isPublished } });
    return c.json({ ok: true, updated: result.count });
  } catch {
    return c.json({ error: "Failed to update properties" }, 500);
  }
});

propertyRoutes.delete("/bulk", zv("json", bulkIdsSchema), async (c) => {
  const { ids } = c.req.valid("json");

  try {
    const result = await prisma.property.deleteMany({ where: { id: { in: ids } } });
    return c.json({ ok: true, deleted: result.count });
  } catch {
    return c.json({ error: "Failed to delete properties" }, 500);
  }
});

propertyRoutes.patch("/:id", zv("json", propertyUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const { imageUrls, featureIds, transitStations, pricingTiers, ...data } = c.req.valid("json");

  try {
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
        ...(pricingTiers !== undefined && {
          pricingTiers: { deleteMany: {}, create: pricingTiers.map((tier, order) => ({ ...tier, order })) },
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
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

propertyRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Property not found" }, 404);
    await prisma.property.delete({ where: { id } });
    return c.json({ ok: true });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default propertyRoutes;
