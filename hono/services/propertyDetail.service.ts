import { prisma } from "@/lib/prisma";
import type { PropertyItem } from "@/app/types";
import { getMinSalePrice, getMinRentPrice } from "@/utils/getMinPrice";
import { buildPropertiesHref } from "@/utils/buildPropertiesHref";
import { getMediaImageUrl } from "@/utils/getMediaImageUrl";

export async function getPropertyBySlug(slug: string, options?: { includeUnpublished?: boolean }) {
  try {
    const property = await prisma.property.findUnique({
      where: options?.includeUnpublished ? { slug } : { slug, isPublished: true },
      include: {
        propertyType: true,
        images: {
          orderBy: { order: "asc" },
          include: { mediaImage: { select: { key: true } } },
        },
        features: { include: { feature: true } },
        transitStations: { include: { station: true } },
        pricingTiers: { orderBy: { order: "asc" } },
        province: { select: { name: true } },
        district: { select: { name: true } },
        subDistrict: { select: { name: true } },
      },
    });

    if (!property) return null;

    return {
      ...property,
      images: property.images.map((img) => ({ id: img.id, order: img.order, url: getMediaImageUrl(img.mediaImage) })),
    };
  } catch {
    return null;
  }
}

interface SimilarPropertiesResult {
  properties: PropertyItem[];
  viewMoreHref: string;
  hasMore: boolean;
}

export async function getSimilarProperties(
  slug: string,
  provinceId: string,
  propertyTypeId: string,
  propertyTypeSlug?: string,
): Promise<SimilarPropertiesResult> {
  const viewMoreHref = buildPropertiesHref({ provinceId, type: propertyTypeSlug });

  try {
    const results = await prisma.property.findMany({
      where: {
        isPublished: true,
        NOT: { slug },
        OR: [{ provinceId }, { propertyTypeId }],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        address: true,
        isForSale: true,
        isForRent: true,
        availabilityStatus: true,
        pricingTiers: { orderBy: { order: "asc" as const } },
        beds: true,
        baths: true,
        areaSqm: true,
        images: {
          take: 1,
          orderBy: { order: "asc" },
          select: { mediaImage: { select: { key: true } } },
        },
        id: true,
      },
    });

    const hasMore = results.length > 4;
    const properties = results.slice(0, 4).map((p) => {
      const listingType = (p.isForSale && p.isForRent ? "Sale & Rent" : p.isForSale ? "Sale" : "Rent") as "Sale & Rent" | "Sale" | "Rent";
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: p.address,
        minSalePrice: getMinSalePrice(p.pricingTiers, p.isForSale),
        minRentPrice: getMinRentPrice(p.pricingTiers, p.isForRent),
        hasMultipleTiers: p.pricingTiers.length > 1,
        listingType,
        availabilityStatus: p.availabilityStatus,
        beds: p.beds ?? 0,
        baths: p.baths ?? 0,
        area: `${p.areaSqm} sqm`,
        imageUrls: p.images.map((img) => getMediaImageUrl(img.mediaImage)),
      };
    });

    return { properties, viewMoreHref, hasMore };
  } catch {
    return { properties: [], viewMoreHref, hasMore: false };
  }
}
