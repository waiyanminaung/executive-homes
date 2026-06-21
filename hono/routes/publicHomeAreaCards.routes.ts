import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/utils/getMediaUrl";

const publicHomeAreaCardsRoutes = new Hono();

const INCLUDE = {
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
} as const;

publicHomeAreaCardsRoutes.get("/", async (c) => {
  const cards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: INCLUDE,
  });

  const areaCards = await Promise.all(
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

      return { ...card, listings, imageUrl: getMediaUrl(card.imageKey) };
    }),
  );

  return c.json({ areaCards });
});

export default publicHomeAreaCardsRoutes;
