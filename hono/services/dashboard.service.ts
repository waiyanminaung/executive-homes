import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
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
        images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
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
    recentProperties,
    propertiesByType,
  };
}
