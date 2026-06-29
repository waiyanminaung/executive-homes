import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const publicTransitStationsRoutes = new Hono();

publicTransitStationsRoutes.get("/", async (c) => {
  try {
    const stations = await prisma.transitStation.findMany({
      where: { properties: { some: { property: { isPublished: true } } } },
      orderBy: [{ line: "asc" }, { name: "asc" }],
    });
    return c.json({ stations });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default publicTransitStationsRoutes;
