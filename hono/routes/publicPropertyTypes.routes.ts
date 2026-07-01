import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const publicPropertyTypesRoutes = new Hono();

publicPropertyTypesRoutes.get("/", async (c) => {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      where: { properties: { some: { isPublished: true } } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return c.json({ propertyTypes });
  } catch {
    return c.json({ propertyTypes: [] });
  }
});

export default publicPropertyTypesRoutes;
