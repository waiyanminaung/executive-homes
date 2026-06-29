import type { PrismaClient } from "../generated/prisma/client";

const AREA_CARDS = [
  {
    name: "Bangkok",
    slug: "bangkok",
    districtSlug: null,
    imageKey: "https://cdn.pixabay.com/photo/2022/02/25/04/10/traffic-jam-7033498_1280.jpg",
    order: 0,
  },
  {
    name: "Sukhumvit",
    slug: "khlong-toei",
    districtSlug: "khlong-toei",
    imageKey: "https://cdn.pixabay.com/photo/2020/06/07/17/31/bangkok-5271328_1280.jpg",
    order: 1,
  },
  {
    name: "Silom",
    slug: "bang-rak",
    districtSlug: "bang-rak",
    imageKey: "https://cdn.pixabay.com/photo/2019/10/22/02/21/asia-4567487_1280.jpg",
    order: 2,
  },
  {
    name: "Chatuchak",
    slug: "chatuchak",
    districtSlug: "chatuchak",
    imageKey: "https://images.unsplash.com/photo-1677943355945-97d9ff7d79e2?q=50&w=1035&auto=format&fit=crop",
    order: 3,
  },
  {
    name: "Ratchathewi",
    slug: "ratchathewi",
    districtSlug: "ratchathewi",
    imageKey: "https://images.unsplash.com/photo-1667715863042-c6d3a08b4bc9?q=50&w=1035&auto=format",
    order: 4,
  },
  {
    name: "Huai Khwang",
    slug: "huai-khwang",
    districtSlug: "huai-khwang",
    imageKey: "https://images.pexels.com/photos/34264219/pexels-photo-34264219.jpeg",
    order: 5,
  },
  {
    name: "Bang Na",
    slug: "bang-na",
    districtSlug: "bang-na",
    imageKey: "https://images.pexels.com/photos/33386988/pexels-photo-33386988.jpeg",
    order: 6,
  },
  {
    name: "Lat Phrao",
    slug: "lat-phrao",
    districtSlug: "lat-phrao",
    imageKey: "https://images.pexels.com/photos/9224363/pexels-photo-9224363.jpeg",
    order: 7,
  },
  {
    name: "Watthana",
    slug: "watthana",
    districtSlug: "watthana",
    imageKey: "https://images.pexels.com/photos/31436465/pexels-photo-31436465.jpeg",
    order: 8,
  },
  {
    name: "Pathum Wan",
    slug: "pathum-wan",
    districtSlug: "pathum-wan",
    imageKey: "https://images.pexels.com/photos/8299700/pexels-photo-8299700.jpeg",
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
