import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { appContentSchema } from "@/validation/appContentSchema";
import { getMediaImageMapForItems, IMAGE_CONTENT_TYPE_SUFFIX } from "@/hono/services/appContent.service";
import { getMediaUrl } from "@/utils/getMediaUrl";
import type { AppEnv } from "@/hono/types";

const appContentRoutes = new Hono<AppEnv>();

appContentRoutes.use("*", authMiddleware, adminMiddleware);

appContentRoutes.get("/", async (c) => {
  const key = c.req.query("key");
  try {
    const items = await prisma.appContent.findMany({
      where: key ? { key } : undefined,
      orderBy: [{ key: "asc" }, { type: "asc" }],
    });

    const mediaImageMap = await getMediaImageMapForItems(items);

    return c.json({
      items: items.map((i) => ({
        ...i,
        mediaImageUrl: i.type.endsWith(IMAGE_CONTENT_TYPE_SUFFIX) && mediaImageMap.has(i.value)
          ? getMediaUrl(mediaImageMap.get(i.value)!.key)
          : null,
      })),
    });
  } catch {
    return c.json({ items: [] });
  }
});

appContentRoutes.put("/", zv("json", appContentSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const item = await prisma.appContent.upsert({
      where: { key_type: { key: data.key, type: data.type } },
      update: { value: data.value },
      create: data,
    });
    return c.json({ item });
  } catch {
    return c.json({ item: null }, 500);
  }
});

export default appContentRoutes;
