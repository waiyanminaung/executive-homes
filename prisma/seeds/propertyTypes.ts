import { PrismaClient } from "../generated/prisma/client";

const PROPERTY_TYPES = [
  { name: "Condo", slug: "condo" },
  { name: "Apartment", slug: "apartment" },
  { name: "House", slug: "house" },
  { name: "Villa", slug: "villa" },
  { name: "Townhouse", slug: "townhouse" },
  { name: "Penthouse", slug: "penthouse" },
  { name: "Office Space", slug: "office-space" },
  { name: "Retail Space", slug: "retail-space" },
  { name: "Commercial Space", slug: "commercial-space" },
  { name: "Warehouse", slug: "warehouse" },
];

export async function seedPropertyTypes(prisma: PrismaClient) {
  console.log("Seeding property types...");

  for (const pt of PROPERTY_TYPES) {
    await prisma.propertyType.upsert({
      where: { slug: pt.slug },
      update: {},
      create: pt,
    });
  }
}
