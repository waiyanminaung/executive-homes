import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { requestSchema } from "@/validation/requestSchema";
import { zv } from "@/validation/zv";

export const requestRoutes = new Hono()
  .get("/", async (c) => {
    const requests = await prisma.request.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return c.json(requests);
  })
  .post("/", zv("json", requestSchema), async (c) => {
    const body = c.req.valid("json");

    await prisma.request.create({
      data: {
        title: body.title,
      },
    });

    return c.json({ ok: true });
  });
