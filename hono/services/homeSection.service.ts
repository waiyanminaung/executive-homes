import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { toListingType, toPrice } from "@/utils/homeSectionUtils";
import type { PropertyItem, PropertySection } from "@/app/types";

export async function getHomeSections(): Promise<PropertySection[]> {
  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { order: "asc" },
    });

    return await Promise.all(
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
          select: {
            id: true, slug: true, title: true,
            isForSale: true, isForRent: true, availabilityStatus: true,
            salePrice: true, rentPrice: true, beds: true, baths: true, areaSqm: true,
            address: true,
            images: { take: 5, orderBy: { order: "asc" }, select: { url: true } },
          },
        });

        const properties: PropertyItem[] = rawProperties.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.address,
          price: toPrice(section.listingType, p.rentPrice, p.salePrice),
          imageUrls: p.images.map((img) => img.url),
          listingType: toListingType(p.isForRent, p.isForSale),
          availabilityStatus: p.availabilityStatus,
          beds: p.beds ?? 0,
          baths: p.baths ?? 0,
          area: `${p.areaSqm.toFixed(2)} sqm`,
        }));

        return { title: section.title, properties };
      }),
    );
  } catch {
    return [];
  }
}
