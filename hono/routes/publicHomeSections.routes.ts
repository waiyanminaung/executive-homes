import { Hono } from "hono";
import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { PropertyItem } from "@/app/types";
import { toListingType } from "@/utils/homeSectionUtils";
import { getMinSalePrice, getMinRentPrice } from "@/utils/getMinPrice";

const publicHomeSectionsRoutes = new Hono();

const PROPERTY_SELECT = {
  id: true, slug: true, title: true,
  isForSale: true, isForRent: true, availabilityStatus: true,
  beds: true, baths: true, areaSqm: true,
  address: true,
  images: { take: 5, orderBy: { order: "asc" as const }, select: { url: true } },
  pricingTiers: { orderBy: { order: "asc" as const }, select: { salePrice: true, rentPrice: true } },
} as const;

publicHomeSectionsRoutes.get("/", async (c) => {
  const sections = await prisma.homeSection.findMany({
    orderBy: { order: "asc" },
    include: {
      propertyType: { select: { id: true, name: true, slug: true } },
      province: { select: { id: true, name: true, slug: true } },
      district: { select: { id: true, name: true, slug: true } },
    },
  });

  const sectionResults = await Promise.all(
    sections.map(async (section) => {
      const where: Prisma.PropertyWhereInput = { isPublished: true };

      if (section.listingType === "RENT") where.isForRent = true;
      if (section.listingType === "SALE") where.isForSale = true;
      if (section.onlyFeatured) where.isFeatured = true;
      if (section.propertyTypeId) where.propertyTypeId = section.propertyTypeId;
      if (section.provinceId) where.provinceId = section.provinceId;
      if (section.districtId) where.districtId = section.districtId;

      const rawProperties = await prisma.property.findMany({
        where,
        take: section.limit,
        orderBy: { createdAt: "desc" },
        select: PROPERTY_SELECT,
      });

      const properties: PropertyItem[] = rawProperties.map((p) => {
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.address,
          minSalePrice: getMinSalePrice(p.pricingTiers, p.isForSale),
          minRentPrice: getMinRentPrice(p.pricingTiers, p.isForRent),
          hasMultipleTiers: p.pricingTiers.length > 1,
          imageUrls: p.images.map((img) => img.url),
          listingType: toListingType(p.isForRent, p.isForSale),
          availabilityStatus: p.availabilityStatus,
          beds: p.beds ?? 0,
          baths: p.baths ?? 0,
          area: `${p.areaSqm.toFixed(2)} sqm`,
        };
      });

      return { ...section, properties };
    }),
  );

  return c.json({ sections: sectionResults });
});

export default publicHomeSectionsRoutes;
