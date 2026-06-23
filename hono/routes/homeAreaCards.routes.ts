import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { homeAreaCardCreateSchema, homeAreaCardUpdateSchema } from "@/validation/homeAreaCardSchema";
import type { AppEnv } from "@/hono/types";

const homeAreaCardsRoutes = new Hono<AppEnv>();

homeAreaCardsRoutes.use("*", authMiddleware, adminMiddleware);

const INCLUDE = {
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
} as const;

homeAreaCardsRoutes.get("/", async (c) => {
  const cards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: INCLUDE,
  });

  const areaCards = await Promise.all(
    cards.map(async (card) => {
      const listingCount = await prisma.property.count({
        where: {
          isPublished: true,
          ...(card.districtId
            ? { districtId: card.districtId }
            : card.provinceId
              ? { provinceId: card.provinceId }
              : {}),
        },
      });

      return { ...card, listingCount, imageUrl: getMediaUrl(card.imageKey) };
    }),
  );

  return c.json({ areaCards });
});

homeAreaCardsRoutes.post("/", zv("json", homeAreaCardCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const areaCard = await prisma.homeAreaCard.create({ data, include: INCLUDE });

  return c.json({ areaCard: { ...areaCard, imageUrl: getMediaUrl(areaCard.imageKey) } }, 201);
});

homeAreaCardsRoutes.patch("/:id", zv("json", homeAreaCardUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const existing = await prisma.homeAreaCard.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Area card not found" }, 404);

  const areaCard = await prisma.homeAreaCard.update({ where: { id }, data, include: INCLUDE });

  return c.json({ areaCard: { ...areaCard, imageUrl: getMediaUrl(areaCard.imageKey) } });
});

homeAreaCardsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.homeAreaCard.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Area card not found" }, 404);

  await prisma.homeAreaCard.delete({ where: { id } });

  return c.json({ ok: true });
});

export default homeAreaCardsRoutes;
