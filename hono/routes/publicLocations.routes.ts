import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const publicLocationsRoutes = new Hono();

const HAS_PUBLISHED = { properties: { some: { isPublished: true } } } as const;

publicLocationsRoutes.get("/provinces", async (c) => {
  const provinces = await prisma.province.findMany({
    where: HAS_PUBLISHED,
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return c.json({ provinces });
});

publicLocationsRoutes.get("/districts", async (c) => {
  const provinceId = c.req.query("provinceId");
  if (!provinceId) return c.json({ districts: [] });

  const districts = await prisma.district.findMany({
    where: { provinceId, ...HAS_PUBLISHED },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, provinceId: true },
  });
  return c.json({ districts });
});

publicLocationsRoutes.get("/subdistricts", async (c) => {
  const districtId = c.req.query("districtId");
  if (!districtId) return c.json({ subDistricts: [] });

  const subDistricts = await prisma.subDistrict.findMany({
    where: { districtId, ...HAS_PUBLISHED },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, districtId: true },
  });
  return c.json({ subDistricts });
});

publicLocationsRoutes.get("/search", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  if (!q) return c.json({ results: [] });

  try {
    const [provinces, districts, subDistricts] = await Promise.all([
      prisma.province.findMany({
        where: { name: { contains: q, mode: "insensitive" }, ...HAS_PUBLISHED },
        select: { id: true, name: true },
        take: 3,
      }),
      prisma.district.findMany({
        where: { name: { contains: q, mode: "insensitive" }, ...HAS_PUBLISHED },
        select: { id: true, name: true, provinceId: true, province: { select: { id: true, name: true } } },
        take: 3,
      }),
      prisma.subDistrict.findMany({
        where: { name: { contains: q, mode: "insensitive" }, ...HAS_PUBLISHED },
        select: { id: true, name: true, districtId: true, district: { select: { id: true, name: true, provinceId: true, province: { select: { id: true, name: true } } } } },
        take: 3,
      }),
    ]);

    const results = [
      ...provinces.map((p) => ({ id: p.id, name: p.name, type: "province" as const, provinceId: p.id })),
      ...districts.map((d) => ({ id: d.id, name: d.name, type: "district" as const, provinceId: d.province.id, provinceName: d.province.name, districtId: d.id })),
      ...subDistricts.map((s) => ({ id: s.id, name: s.name, type: "subdistrict" as const, provinceId: s.district.province.id, provinceName: s.district.province.name, districtId: s.district.id, districtName: s.district.name, subDistrictId: s.id })),
    ];

    return c.json({ results });
  } catch {
    return c.json({ results: [] });
  }
});

export default publicLocationsRoutes;
