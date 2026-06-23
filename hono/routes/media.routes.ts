import fs from "fs";
import path from "path";
import { Hono } from "hono";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { r2, R2_BUCKET } from "@/lib/r2";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE, QUALITY_REDUCTION_THRESHOLD } from "@/validation/mediaSchema";
import type { AppEnv } from "@/hono/types";

const WATERMARK_WIDTH_RATIO = 0.25;
const WATERMARK_PADDING_RATIO = 0.02;
const WATERMARK_OPACITY = 0.45;

const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.use("*", authMiddleware, adminMiddleware);

mediaRoutes.get("/", async (c) => {
  const { page = "1", limit = "30", search = "" } = c.req.query();
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where = search ? { filename: { contains: search, mode: "insensitive" as const } } : {};

  const [images, total] = await Promise.all([
    prisma.mediaImage.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limitNum }),
    prisma.mediaImage.count({ where }),
  ]);

  return c.json({
    images: images.map((img) => ({ ...img, url: getMediaUrl(img.key) })),
    total,
    page: pageNum,
    limit: limitNum,
  });
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
  const watermark = formData.get("watermark") === "true";
  const isAlreadyWebP = file.type === "image/webp";
  const quality = file.size < QUALITY_REDUCTION_THRESHOLD ? 100 : 80;

  let finalBuffer: Buffer;

  if (watermark) {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBuffer = fs.readFileSync(logoPath);

    const meta = await sharp(buffer).metadata();
    const imageWidth = meta.width ?? 1200;
    const watermarkWidth = Math.round(imageWidth * WATERMARK_WIDTH_RATIO);
    const padding = Math.round(imageWidth * WATERMARK_PADDING_RATIO);

    const { data: logoData, info: logoInfo } = await sharp(logoBuffer)
      .resize(watermarkWidth)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 3; i < logoData.length; i += 4) {
      logoData[i] = Math.round(logoData[i] * WATERMARK_OPACITY);
    }

    const resizedLogo = await sharp(logoData, {
      raw: { width: logoInfo.width, height: logoInfo.height, channels: 4 },
    })
      .extend({
        bottom: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    finalBuffer = await sharp(buffer)
      .composite([{ input: resizedLogo, gravity: "southeast" }])
      .webp({ quality: isAlreadyWebP ? 100 : quality })
      .toBuffer();
  } else if (isAlreadyWebP) {
    finalBuffer = buffer;
  } else {
    finalBuffer = await sharp(buffer).webp({ quality }).toBuffer();
  }

  const finalMimeType = "image/webp";
  const fileExtension = "webp";

  const key = `media/${crypto.randomUUID().replace(/-/g, "")}.${fileExtension}`;
  const filename = file.name.replace(/\.[^.]+$/, `.${fileExtension}`);

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: finalBuffer,
      ContentType: finalMimeType,
    }),
  );

  const image = await prisma.mediaImage.create({
    data: {
      key,
      filename,
      size: finalBuffer.length,
      mimeType: finalMimeType,
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
