import { prisma } from "@/lib/prisma";
import type { PropertyItem } from "@/app/types";

export async function getPropertyBySlug(slug: string) {
  try {
    return await prisma.property.findUnique({
      where: { slug, isPublished: true },
      include: {
        propertyType: true,
        images: { orderBy: { order: "asc" } },
        features: { include: { feature: true } },
        transitStations: { include: { station: true } },
        province: { select: { name: true } },
        district: { select: { name: true } },
        subDistrict: { select: { name: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getSimilarProperties(slug: string, provinceId: string, propertyTypeId: string): Promise<PropertyItem[]> {
  try {
    const results = await prisma.property.findMany({
      where: {
        isPublished: true,
        NOT: { slug },
        OR: [{ provinceId }, { propertyTypeId }],
      },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        address: true,
        isForSale: true,
        isForRent: true,
        availabilityStatus: true,
        salePrice: true,
        rentPrice: true,
        beds: true,
        baths: true,
        areaSqm: true,
        images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
        id: true,
      },
    });

    return results.map((p) => {
      const listingType = p.isForSale && p.isForRent ? "Sale & Rent" : p.isForSale ? "Sale" : "Rent";

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: p.address,
        price: p.isForSale ? (p.salePrice ?? 0) : (p.rentPrice ?? 0),
        listingType,
        availabilityStatus: p.availabilityStatus,
        beds: p.beds ?? 0,
        baths: p.baths ?? 0,
        area: `${p.areaSqm} sqm`,
        imageUrls: p.images.map((img) => img.url),
      };
    });
  } catch {
    return [];
  }
}
