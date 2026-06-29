import type { PrismaClient } from "../generated/prisma/client";

const AREA_CARDS = [
  {
    name: "Bangkok",
    slug: "bangkok",
    districtSlug: null,
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/35685f61d5f148e3a990f4b53658134f.webp",
    order: 0,
  },
  {
    name: "Sukhumvit",
    slug: "khlong-toei",
    districtSlug: "khlong-toei",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/9299c9b5531a469aa4182f9988be465c.webp",
    order: 1,
  },
  {
    name: "Silom",
    slug: "bang-rak",
    districtSlug: "bang-rak",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/be554b9e67b64b968b7f4f801595b0e6.webp",
    order: 2,
  },
  {
    name: "Chatuchak",
    slug: "chatuchak",
    districtSlug: "chatuchak",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d1c23b37cdaf49ebb867810c131df981.webp",
    order: 3,
  },
  {
    name: "Ratchathewi",
    slug: "ratchathewi",
    districtSlug: "ratchathewi",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/899dbd406f764df88aaaeec2328d42d8.webp",
    order: 4,
  },
  {
    name: "Huai Khwang",
    slug: "huai-khwang",
    districtSlug: "huai-khwang",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/175c4a5488594df49d796bda54027e02.webp",
    order: 5,
  },
  {
    name: "Bang Na",
    slug: "bang-na",
    districtSlug: "bang-na",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/940f22271533415d94b18a9fa3c30652.webp",
    order: 6,
  },
  {
    name: "Lat Phrao",
    slug: "lat-phrao",
    districtSlug: "lat-phrao",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/4f6561b16458451aa2dbef1e3504c9ea.webp",
    order: 7,
  },
  {
    name: "Watthana",
    slug: "watthana",
    districtSlug: "watthana",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d2d5a6e563ca4a5cafaae2efac96fe33.webp",
    order: 8,
  },
  {
    name: "Pathum Wan",
    slug: "pathum-wan",
    districtSlug: "pathum-wan",
    imageKey: "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/aca85fbf248441508c9ce0223862cf16.webp",
    order: 9,
  },
];

export async function seedHomeAreaCards(prisma: PrismaClient) {
  const bangkok = await prisma.province.findUnique({ where: { slug: "bangkok" } });
  if (!bangkok) {
    console.warn("Bangkok province not found — skipping home area cards seed.");
    return;
  }

  for (const card of AREA_CARDS) {
    let districtId: string | null = null;

    if (card.districtSlug) {
      const district = await prisma.district.findFirst({
        where: { slug: card.districtSlug, provinceId: bangkok.id },
      });
      districtId = district?.id ?? null;
    }

    await prisma.homeAreaCard.upsert({
      where: { id: `seed-area-${card.slug}` },
      update: { name: card.name, imageKey: card.imageKey, order: card.order, provinceId: bangkok.id, districtId },
      create: { id: `seed-area-${card.slug}`, name: card.name, imageKey: card.imageKey, order: card.order, provinceId: bangkok.id, districtId },
    });
  }

  console.log(`Seeded ${AREA_CARDS.length} home area cards.`);
}
