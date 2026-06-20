import { Hono } from "hono";
import { z } from "zod";
import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { zv } from "@/validation/zv";

const publicPropertiesRoutes = new Hono();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  isForSale: z.coerce.boolean().optional(),
  isForRent: z.coerce.boolean().optional(),
  type: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  beds: z.coerce.number().int().optional(),
  q: z.string().optional(),
  sort: z.enum(["default", "price-asc", "price-desc"]).optional(),
});

publicPropertiesRoutes.get("/", zv("query", listQuerySchema), async (c) => {
  const { page, limit, isForSale, isForRent, type, provinceId, districtId, beds, q, sort } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = { isPublished: true };

  if (isForSale !== undefined) where.isForSale = isForSale;
  if (isForRent !== undefined) where.isForRent = isForRent;
  if (type) where.propertyType = { slug: type };
  if (provinceId) where.provinceId = provinceId;
  if (districtId) where.districtId = districtId;
  if (beds !== undefined) where.beds = beds;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const orderBy =
    sort === "price-asc"
      ? { salePrice: "asc" as const }
      : sort === "price-desc"
        ? { salePrice: "desc" as const }
        : { createdAt: "desc" as const };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true, slug: true, title: true,
        isForSale: true, isForRent: true, availabilityStatus: true,
        propertyType: { select: { id: true, name: true, slug: true } },
        salePrice: true, rentPrice: true, beds: true, baths: true, areaSqm: true,
        address: true, isFeatured: true, isPublished: true, isPetFriendly: true, createdAt: true,
        images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return c.json({ properties, total, page, limit });
});

publicPropertiesRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const property = await prisma.property.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: { order: "asc" } },
      features: { include: { feature: true } },
      transitStations: { include: { station: true } },
      province: { select: { id: true, name: true, slug: true } },
      district: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!property) return c.json({ error: "Property not found" }, 404);

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
      transitStations: property.transitStations,
    },
  });
});

export default publicPropertiesRoutes;
