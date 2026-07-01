import { PrismaClient } from "../generated/prisma/client";

export const SEED_SYSTEM_USER_ID = "seed-system-user";

export async function seedSystemUser(prisma: PrismaClient) {
  return prisma.user.upsert({
    where: { id: SEED_SYSTEM_USER_ID },
    update: {},
    create: {
      id: SEED_SYSTEM_USER_ID,
      name: "Seed System",
      email: "system@seed.local",
      emailVerified: true,
      role: "ADMIN",
    },
  });
}
