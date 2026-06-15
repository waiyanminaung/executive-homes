import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { seedProvinces } from "./seeds/provinces";
import { seedFeatures } from "./seeds/features";
import { seedTransitStations } from "./seeds/transitStations";
import { seedPropertyTypes } from "./seeds/propertyTypes";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedPropertyTypes(prisma);
  await seedProvinces(prisma);
  await seedFeatures(prisma);
  await seedTransitStations(prisma);

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
