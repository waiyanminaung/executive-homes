import { PrismaClient } from "../generated/prisma/client";
import { SEED_SYSTEM_USER_ID } from "./users";

export function keyFromSeedUrl(url: string) {
  return url.split("/").slice(-2).join("/");
}

export async function upsertSeedMediaImage(prisma: PrismaClient, url: string) {
  const key = keyFromSeedUrl(url);

  return prisma.mediaImage.upsert({
    where: { key },
    update: {},
    create: {
      key,
      filename: key.replace("media/", ""),
      size: 0,
      mimeType: "image/webp",
      uploadedById: SEED_SYSTEM_USER_ID,
    },
  });
}

export async function upsertSeedMediaImages(prisma: PrismaClient, urls: string[]) {
  const mediaImages = [];

  for (const url of urls) {
    mediaImages.push(await upsertSeedMediaImage(prisma, url));
  }

  return mediaImages;
}
