import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { TRANSIT_STATION_PRESETS } from "@/constants/transitStations";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROVINCES = [
  { name: "Bangkok", slug: "bangkok" },
  { name: "Nonthaburi", slug: "nonthaburi" },
  { name: "Samut Prakan", slug: "samut-prakan" },
];

const BANGKOK_DISTRICTS = [
  { name: "Watthana", slug: "watthana" },
  { name: "Bang Rak", slug: "bang-rak" },
  { name: "Sathon", slug: "sathon" },
  { name: "Pathum Wan", slug: "pathum-wan" },
  { name: "Khlong Toei", slug: "khlong-toei" },
  { name: "Ratchathewi", slug: "ratchathewi" },
  { name: "Din Daeng", slug: "din-daeng" },
  { name: "Huai Khwang", slug: "huai-khwang" },
  { name: "Phaya Thai", slug: "phaya-thai" },
  { name: "Yan Nawa", slug: "yan-nawa" },
  { name: "Klong San", slug: "klong-san" },
  { name: "Phra Nakhon", slug: "phra-nakhon" },
];

const FEATURES = [
  { label: "Swimming Pool", slug: "swimming-pool", category: "COMMON_FACILITY" as const },
  { label: "Fitness Center", slug: "fitness-center", category: "COMMON_FACILITY" as const },
  { label: "Parking", slug: "parking", category: "UNIT_FEATURE" as const },
  { label: "Balcony", slug: "balcony", category: "UNIT_FEATURE" as const },
  { label: "Pet Friendly", slug: "pet-friendly", category: "UNIT_FEATURE" as const },
  { label: "High Floor View", slug: "high-floor-view", category: "UNIT_FEATURE" as const },
  { label: "Maid Room", slug: "maid-room", category: "UNIT_FEATURE" as const },
  { label: "Study Room", slug: "study-room", category: "UNIT_FEATURE" as const },
  { label: "Private Pool", slug: "private-pool", category: "UNIT_FEATURE" as const },
  { label: "Jacuzzi", slug: "jacuzzi", category: "UNIT_FEATURE" as const },
  { label: "Rooftop Garden", slug: "rooftop-garden", category: "COMMON_FACILITY" as const },
  { label: "Co-working Space", slug: "co-working-space", category: "COMMON_FACILITY" as const },
  { label: "Concierge", slug: "concierge", category: "COMMON_FACILITY" as const },
  { label: "24-Hour Security", slug: "24hr-security", category: "COMMON_FACILITY" as const },
  { label: "CCTV", slug: "cctv", category: "COMMON_FACILITY" as const },
  { label: "Shuttle Service", slug: "shuttle-service", category: "COMMON_FACILITY" as const },
  { label: "Tennis Court", slug: "tennis-court", category: "COMMON_FACILITY" as const },
  { label: "Playground", slug: "playground", category: "COMMON_FACILITY" as const },
  { label: "BBQ Area", slug: "bbq-area", category: "COMMON_FACILITY" as const },
  { label: "Sauna", slug: "sauna", category: "COMMON_FACILITY" as const },
];

async function main() {
  console.log("Seeding provinces...");
  const bangkok = await prisma.province.upsert({
    where: { slug: "bangkok" },
    update: {},
    create: { name: "Bangkok", slug: "bangkok" },
  });

  for (const p of PROVINCES.filter((pr) => pr.slug !== "bangkok")) {
    await prisma.province.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seeding Bangkok districts...");
  for (const d of BANGKOK_DISTRICTS) {
    await prisma.district.upsert({
      where: { slug_provinceId: { slug: d.slug, provinceId: bangkok.id } },
      update: {},
      create: { ...d, provinceId: bangkok.id },
    });
  }

  console.log("Seeding features...");
  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
  }

  console.log("Seeding transit stations...");
  for (const s of TRANSIT_STATION_PRESETS) {
    await prisma.transitStation.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
