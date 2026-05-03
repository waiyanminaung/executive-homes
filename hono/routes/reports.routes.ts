import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/validation/reportSchema";
import { zv } from "@/validation/zv";

export const reportRoutes = new Hono()
  .get("/", async (c) => {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return c.json(reports);
  })
  .post("/", zv("json", reportSchema), async (c) => {
    const body = c.req.valid("json");

    await prisma.report.create({
      data: {
        title: body.title,
        reason: body.reason,
        description: body.description,
      },
    });

    return c.json({ ok: true });
  });
