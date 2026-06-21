import { PrismaClient } from "../generated/prisma/client";

export async function seedContactInfo(prisma: PrismaClient) {
  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: "+66(0)92-598-7462",
      email: "ehb.bkk@gmail.com",
      whatsapp: "+66(0)92-598-7462",
      address: "59/109 Soi 26 Sukhumvit Rd, Klongtoey, Bangkok",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      line: "https://line.me",
    },
  });
}
