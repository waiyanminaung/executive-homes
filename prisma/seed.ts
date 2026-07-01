import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { seedSystemUser } from "./seeds/users";
import { seedProvinces } from "./seeds/provinces";
import { seedFeatures } from "./seeds/features";
import { seedTransitStations } from "./seeds/transitStations";
import { seedPropertyTypes } from "./seeds/propertyTypes";
import { seedContactInfo } from "./seeds/contactInfo";
import { seedProperties } from "./seeds/properties";
import { seedHomeAreaCards } from "./seeds/homeAreaCards";
import { seedHomeSections } from "./seeds/homeSections";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedSystemUser(prisma);
  await seedPropertyTypes(prisma);
  await seedProvinces(prisma);
  await seedFeatures(prisma);
  await seedTransitStations(prisma);
  await seedContactInfo(prisma);
  await seedProperties(prisma);
  await seedHomeAreaCards(prisma);
  await seedHomeSections(prisma);

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
