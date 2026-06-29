import type { PrismaClient } from "../generated/prisma/client";

const HOME_SECTIONS = [
  {
    id: "seed-section-featured-rentals",
    title: "Featured Rentals",
    listingType: "RENT" as const,
    onlyFeatured: false,
    onlyPetFriendly: false,
    limit: 8,
    order: 0,
  },
  {
    id: "seed-section-featured-sales",
    title: "Featured Sales",
    listingType: "SALE" as const,
    onlyFeatured: false,
    onlyPetFriendly: false,
    limit: 8,
    order: 1,
  },
];

export async function seedHomeSections(prisma: PrismaClient) {
  console.log("Seeding home sections...");

  for (const section of HOME_SECTIONS) {
    await prisma.homeSection.upsert({
      where: { id: section.id },
      update: {
        title: section.title,
        listingType: section.listingType,
        onlyFeatured: section.onlyFeatured,
        onlyPetFriendly: section.onlyPetFriendly,
        limit: section.limit,
        order: section.order,
      },
      create: section,
    });
  }

  console.log(`Seeded ${HOME_SECTIONS.length} home sections.`);
}
