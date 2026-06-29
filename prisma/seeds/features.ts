import { PrismaClient } from "../generated/prisma/client";

interface FeatureSeed {
  label: string;
  slug: string;
  category: "AMENITY" | "UNIT_FEATURE";
  icon?: string;
}

const FEATURES: FeatureSeed[] = [
  { label: "Swimming Pool", slug: "swimming-pool", category: "AMENITY" as const },
  { label: "Fitness Center", slug: "fitness-center", category: "AMENITY" as const },
  { label: "Parking", slug: "parking", category: "UNIT_FEATURE" as const, icon: "Car" },
  { label: "Balcony", slug: "balcony", category: "UNIT_FEATURE" as const, icon: "Sun" },
  { label: "Pet Friendly", slug: "pet-friendly", category: "UNIT_FEATURE" as const, icon: "PawPrint" },
  { label: "High Floor View", slug: "high-floor-view", category: "UNIT_FEATURE" as const, icon: "Eye" },
  { label: "Maid Room", slug: "maid-room", category: "UNIT_FEATURE" as const, icon: "Key" },
  { label: "Study Room", slug: "study-room", category: "UNIT_FEATURE" as const, icon: "School" },
  { label: "Private Pool", slug: "private-pool", category: "UNIT_FEATURE" as const, icon: "Waves" },
  { label: "Jacuzzi", slug: "jacuzzi", category: "UNIT_FEATURE" as const, icon: "Bath" },
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
  { label: "Elevator", slug: "elevator", category: "AMENITY" as const },
  { label: "Garden", slug: "garden", category: "AMENITY" as const },
  { label: "Squash Room", slug: "squash-room", category: "AMENITY" as const },
  { label: "Steam Room", slug: "steam-room", category: "AMENITY" as const },
  { label: "Meeting Room", slug: "meeting-room", category: "AMENITY" as const },
  { label: "Function Room", slug: "function-room", category: "AMENITY" as const },
  { label: "Shop on Premises", slug: "shop-on-premises", category: "AMENITY" as const },
  { label: "Kids Room", slug: "kids-room", category: "AMENITY" as const },
  { label: "Theater Room", slug: "theater-room", category: "AMENITY" as const },
  { label: "Library Room", slug: "library-room", category: "AMENITY" as const },
  { label: "EV Charger", slug: "ev-charger", category: "AMENITY" as const },
];

export async function seedFeatures(prisma: PrismaClient) {
  console.log("Seeding features...");

  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { slug: f.slug },
      update: { icon: f.icon ?? null },
      create: f,
    });
  }
}
