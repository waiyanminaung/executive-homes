import { prisma } from "@/lib/prisma";
import { getMediaImageUrl } from "@/utils/getMediaImageUrl";

const EMPTY_DASHBOARD_DATA = {
  publishedCount: 0,
  draftCount: 0,
  totalEnquiries: 0,
  unreadEnquiries: 0,
  recentEnquiries: [],
  recentProperties: [],
  propertiesByType: [],
};

export async function getDashboardData() {
  try {
    const [
      publishedCount,
      draftCount,
      totalEnquiries,
      unreadEnquiries,
      recentEnquiries,
      recentProperties,
      propertiesByType,
    ] = await Promise.all([
      prisma.property.count({ where: { isPublished: true } }),
      prisma.property.count({ where: { isPublished: false } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { isRead: false } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { property: { select: { title: true, slug: true } } },
      }),
      prisma.property.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        include: {
          propertyType: { select: { name: true } },
          province: { select: { name: true } },
          images: {
            take: 1,
            orderBy: { order: "asc" },
            select: { mediaImage: { select: { key: true } } },
          },
          pricingTiers: { orderBy: { order: "asc" as const } },
        },
      }),
      prisma.propertyType.findMany({
        include: { _count: { select: { properties: { where: { isPublished: true } } } } },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      publishedCount,
      draftCount,
      totalEnquiries,
      unreadEnquiries,
      recentEnquiries,
      recentProperties: recentProperties.map((property) => ({
        ...property,
        images: property.images.map((img) => ({ url: getMediaImageUrl(img.mediaImage) })),
      })),
      propertiesByType,
    };
  } catch {
    return EMPTY_DASHBOARD_DATA;
  }
}
