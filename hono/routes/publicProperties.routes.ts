import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { getMediaImageUrl } from "@/utils/getMediaImageUrl";
import { zv } from "@/validation/zv";
import { publicPropertyListQuerySchema } from "@/validation/publicPropertySchema";

const publicPropertiesRoutes = new Hono();

publicPropertiesRoutes.get("/", zv("query", publicPropertyListQuerySchema), async (c) => {
  const { page, limit, isForSale, isForRent, type, provinceId, districtId, subDistrictIds, isPetFriendly, beds, q, stationIds, minPrice, maxPrice } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (isForSale !== undefined) where.isForSale = isForSale;
  if (isForRent !== undefined) where.isForRent = isForRent;
  if (type) where.propertyType = { slug: type };
  if (provinceId) where.provinceId = provinceId;
  if (districtId) where.districtId = districtId;
  if (beds !== undefined) {
    if (beds === "5") where.beds = { gte: 5 };
    else where.beds = Number(beds);
  }
  if (isPetFriendly) where.isPetFriendly = true;
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (subDistrictIds) {
    const ids = subDistrictIds.split(",").filter(Boolean);
    where.subDistrictId = { in: ids };
  }
  if (stationIds) {
    const ids = stationIds.split(",").filter(Boolean);
    where.transitStations = { some: { stationId: { in: ids } } };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    const tierWhere: Record<string, unknown> = {};
    if (minPrice !== undefined) tierWhere.salePrice = { gte: minPrice };
    if (maxPrice !== undefined) tierWhere.salePrice = { ...(typeof tierWhere.salePrice === "object" && tierWhere.salePrice !== null ? tierWhere.salePrice : {}), lte: maxPrice };
    where.pricingTiers = { some: tierWhere };
  }

  const orderBy = { createdAt: "desc" as const };

  try {
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
          pricingTiers: { orderBy: { order: "asc" as const } },
          beds: true, baths: true, areaSqm: true,
          address: true, isFeatured: true, isPublished: true, isPetFriendly: true, createdAt: true,
          images: {
            take: 5,
            orderBy: { order: "asc" },
            select: { mediaImage: { select: { key: true } } },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    const propertiesWithImageUrls = properties.map((property) => ({
      ...property,
      images: property.images.map((img) => ({ url: getMediaImageUrl(img.mediaImage) })),
    }));

    return c.json({ properties: propertiesWithImageUrls, total, page, limit });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

publicPropertiesRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const property = await prisma.property.findUnique({
      where: { slug, isPublished: true },
      include: {
        images: {
          orderBy: { order: "asc" },
          include: { mediaImage: { select: { key: true } } },
        },
        features: { include: { feature: true } },
        transitStations: { include: { station: true } },
        pricingTiers: { orderBy: { order: "asc" as const } },
        province: { select: { id: true, name: true, slug: true } },
        district: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!property) return c.json({ error: "Property not found" }, 404);

    return c.json({
      property: {
        ...property,
        images: property.images.map((img) => ({ id: img.id, order: img.order, url: getMediaImageUrl(img.mediaImage) })),
        features: property.features.map((pf) => pf.feature),
        transitStations: property.transitStations,
      },
    });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default publicPropertiesRoutes;
