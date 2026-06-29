import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { toListingType } from "@/utils/homeSectionUtils";
import { getMinSalePrice, getMinRentPrice } from "@/utils/getMinPrice";
import { buildPropertiesHref } from "@/utils/buildPropertiesHref";
import type { PropertyItem, PropertySection } from "@/app/types";

export async function getHomeSections(): Promise<PropertySection[]> {
  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { order: "asc" },
      include: {
        propertyType: { select: { slug: true } },
        province: { select: { name: true } },
        district: { select: { name: true } },
      },
    });

    return await Promise.all(
      sections.map(async (section) => {
        const where: Prisma.PropertyWhereInput = { isPublished: true };

        if (section.listingType === "RENT") where.isForRent = true;
        if (section.listingType === "SALE") where.isForSale = true;
        if (section.onlyFeatured) where.isFeatured = true;
        if (section.onlyPetFriendly) where.isPetFriendly = true;
        if (section.propertyTypeId) where.propertyTypeId = section.propertyTypeId;
        if (section.provinceId) where.provinceId = section.provinceId;
        if (section.districtId) where.districtId = section.districtId;

        const rawProperties = await prisma.property.findMany({
          where,
          take: section.limit + 1,
          orderBy: { createdAt: "desc" },
          select: {
            id: true, slug: true, title: true,
            isForSale: true, isForRent: true, availabilityStatus: true,
            beds: true, baths: true, areaSqm: true,
            address: true,
            images: { take: 5, orderBy: { order: "asc" }, select: { url: true } },
            pricingTiers: { orderBy: { order: "asc" }, select: { salePrice: true, rentPrice: true } },
          },
        });

        const hasMore = rawProperties.length > section.limit;
        const properties: PropertyItem[] = rawProperties.slice(0, section.limit).map((p) => {
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

        const locationLabel = section.district?.name ?? section.province?.name ?? undefined;

        const viewMoreHref = buildPropertiesHref({
          listingType: section.listingType === "RENT" ? "rent" : "buy",
          type: section.propertyType?.slug ?? undefined,
          provinceId: section.provinceId ?? undefined,
          districtId: section.districtId ?? undefined,
          locationLabel,
        });

        return { title: section.title, viewMoreHref, properties, hasMore };
      }),
    );
  } catch {
    return [];
  }
}
