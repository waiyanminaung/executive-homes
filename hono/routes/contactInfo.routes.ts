import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { contactInfoSchema } from "@/validation/contactInfoSchema";
import type { AppEnv } from "@/hono/types";

const contactInfoRoutes = new Hono<AppEnv>();

contactInfoRoutes.use("*", authMiddleware, adminMiddleware);

contactInfoRoutes.get("/", async (c) => {
  const contactInfo = await prisma.contactInfo.findUnique({ where: { id: "singleton" } });

  return c.json({ contactInfo });
});

contactInfoRoutes.put("/", zv("json", contactInfoSchema), async (c) => {
  const data = c.req.valid("json");

  const contactInfo = await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return c.json({ contactInfo });
});

export default contactInfoRoutes;
