import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const publicLocationsRoutes = new Hono();

publicLocationsRoutes.get("/provinces", async (c) => {
  const provinces = await prisma.province.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return c.json({ provinces });
});

publicLocationsRoutes.get("/districts", async (c) => {
  const provinceId = c.req.query("provinceId");
  if (!provinceId) return c.json({ districts: [] });

  const districts = await prisma.district.findMany({
    where: { provinceId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, provinceId: true },
  });
  return c.json({ districts });
});

publicLocationsRoutes.get("/subdistricts", async (c) => {
  const districtId = c.req.query("districtId");
  if (!districtId) return c.json({ subDistricts: [] });

  const subDistricts = await prisma.subDistrict.findMany({
    where: { districtId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, districtId: true },
  });
  return c.json({ subDistricts });
});

export default publicLocationsRoutes;
