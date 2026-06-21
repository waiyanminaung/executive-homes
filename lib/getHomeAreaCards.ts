import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/utils/getMediaUrl";
import type { ClientHomeAreaCard } from "@/types/homeAreaCard";

export async function getHomeAreaCards(): Promise<ClientHomeAreaCard[]> {
  const cards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: {
      province: { select: { id: true, name: true, slug: true } },
      district: { select: { id: true, name: true, slug: true } },
    },
  });

  return Promise.all(
    cards.map(async (card) => {
      let listings = 0;

      if (card.districtId) {
        listings = await prisma.property.count({
          where: { isPublished: true, districtId: card.districtId },
        });
      } else if (card.provinceId) {
        listings = await prisma.property.count({
          where: { isPublished: true, provinceId: card.provinceId },
        });
      }

      return {
        ...card,
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
        listings,
        listingCount: listings,
        imageUrl: getMediaUrl(card.imageKey),
      };
    }),
  );
}
