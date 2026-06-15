import { PrismaClient } from "../generated/prisma/client";

const FEATURES = [
  { label: "Swimming Pool", slug: "swimming-pool", category: "AMENITY" as const },
  { label: "Fitness Center", slug: "fitness-center", category: "AMENITY" as const },
  { label: "Parking", slug: "parking", category: "UNIT_FEATURE" as const },
  { label: "Balcony", slug: "balcony", category: "UNIT_FEATURE" as const },
  { label: "Pet Friendly", slug: "pet-friendly", category: "UNIT_FEATURE" as const },
  { label: "High Floor View", slug: "high-floor-view", category: "UNIT_FEATURE" as const },
  { label: "Maid Room", slug: "maid-room", category: "UNIT_FEATURE" as const },
  { label: "Study Room", slug: "study-room", category: "UNIT_FEATURE" as const },
  { label: "Private Pool", slug: "private-pool", category: "UNIT_FEATURE" as const },
  { label: "Jacuzzi", slug: "jacuzzi", category: "UNIT_FEATURE" as const },
  { label: "Rooftop Garden", slug: "rooftop-garden", category: "AMENITY" as const },
  { label: "Co-working Space", slug: "co-working-space", category: "AMENITY" as const },
  { label: "Concierge", slug: "concierge", category: "AMENITY" as const },
  { label: "24-Hour Security", slug: "24hr-security", category: "AMENITY" as const },
  { label: "CCTV", slug: "cctv", category: "AMENITY" as const },
  { label: "Shuttle Service", slug: "shuttle-service", category: "AMENITY" as const },
  { label: "Tennis Court", slug: "tennis-court", category: "AMENITY" as const },
  { label: "Playground", slug: "playground", category: "AMENITY" as const },
  { label: "BBQ Area", slug: "bbq-area", category: "AMENITY" as const },
  { label: "Sauna", slug: "sauna", category: "AMENITY" as const },
];

export async function seedFeatures(prisma: PrismaClient) {
  console.log("Seeding features...");

  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
  }
}
