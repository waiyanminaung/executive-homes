import { PrismaClient } from "../generated/prisma/client";
import { TRANSIT_STATION_PRESETS } from "@/constants/transitStations";

export async function seedTransitStations(prisma: PrismaClient) {
  console.log("Seeding transit stations...");

  for (const s of TRANSIT_STATION_PRESETS) {
    await prisma.transitStation.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
}
