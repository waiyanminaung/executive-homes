import { prisma } from "@/lib/prisma";
import { getMediaImageUrl } from "@/utils/getMediaImageUrl";

export const IMAGE_CONTENT_TYPE_SUFFIX = "Image";

export async function getMediaImageMapForItems(items: { type: string; value: string }[]) {
  const imageIds = items
    .filter((i) => i.type.endsWith(IMAGE_CONTENT_TYPE_SUFFIX) && i.value)
    .map((i) => i.value);

  if (!imageIds.length) return new Map<string, { key: string }>();

  const mediaImages = await prisma.mediaImage.findMany({
    where: { id: { in: imageIds } },
    select: { id: true, key: true },
  });

  return new Map(mediaImages.map((mi) => [mi.id, mi]));
}

export async function getAppContent(key: string): Promise<Record<string, string>> {
  try {
    const items = await prisma.appContent.findMany({ where: { key } });
    const mediaImageMap = await getMediaImageMapForItems(items);

    return Object.fromEntries(
      items.map((i) => {
        if (!i.type.endsWith(IMAGE_CONTENT_TYPE_SUFFIX)) return [i.type, i.value];

        const mediaImage = mediaImageMap.get(i.value);
        return [i.type, mediaImage ? getMediaImageUrl(mediaImage) : ""];
      }),
    );
  } catch {
    return {};
  }
}
