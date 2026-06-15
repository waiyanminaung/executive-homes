import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import type { AppEnv } from "@/hono/types";

const adminEnquiriesRoutes = new Hono<AppEnv>();

adminEnquiriesRoutes.use("*", authMiddleware, adminMiddleware);

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isRead: z.enum(["true", "false"]).optional(),
});

adminEnquiriesRoutes.get("/", zv("query", listQuerySchema), async (c) => {
  const { page, limit, isRead } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where = isRead !== undefined ? { isRead: isRead === "true" } : {};

  const [enquiries, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.enquiry.count({ where }),
  ]);

  return c.json({ enquiries, total, page, limit });
});

adminEnquiriesRoutes.patch("/:id/read", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.enquiry.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Enquiry not found" }, 404);

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { isRead: true },
  });
  return c.json({ enquiry });
});

adminEnquiriesRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.enquiry.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Enquiry not found" }, 404);
  await prisma.enquiry.delete({ where: { id } });
  return c.json({ ok: true });
});

export default adminEnquiriesRoutes;
