import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

export const categoryRoutes = new Hono().get("/", async (c) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      orderIndex: "asc",
    },
  });

  return c.json(categories);
});
