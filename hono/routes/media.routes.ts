import { Hono } from "hono";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { r2, R2_BUCKET } from "@/lib/r2";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE } from "@/validation/mediaSchema";
import type { AppEnv } from "@/hono/types";

const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.use("*", authMiddleware, adminMiddleware);

mediaRoutes.get("/", async (c) => {
  const images = await prisma.mediaImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return c.json({ images: images.map((img) => ({ ...img, url: getMediaUrl(img.key) })) });
});

mediaRoutes.post("/", async (c) => {
  const user = c.get("user");
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return c.json({ error: "File type not allowed" }, 400);
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return c.json({ error: "File too large (max 10MB)" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

  const key = `media/${crypto.randomUUID().replace(/-/g, "")}.webp`;
  const filename = file.name.replace(/\.[^.]+$/, ".webp");

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
    }),
  );

  const image = await prisma.mediaImage.create({
    data: {
      key,
      filename,
      size: webpBuffer.length,
      mimeType: "image/webp",
      uploadedById: user.id,
    },
  });

  return c.json({ ...image, url: getMediaUrl(image.key) }, 201);
});

mediaRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const image = await prisma.mediaImage.findUnique({ where: { id } });
  if (!image) return c.json({ error: "Not found" }, 404);

  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: image.key }));
  await prisma.mediaImage.delete({ where: { id } });

  return c.json({ ok: true });
});

export default mediaRoutes;
