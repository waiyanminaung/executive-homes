import { prisma } from "@/lib/prisma";
import type { PropertyTypeItem } from "@/types/propertyType";

export async function getPublicPropertyTypes(): Promise<PropertyTypeItem[]> {
  try {
    return await prisma.propertyType.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}
