import { PrismaClient } from "../generated/prisma/client";

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

export async function seedProvinces(prisma: PrismaClient) {
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
}
