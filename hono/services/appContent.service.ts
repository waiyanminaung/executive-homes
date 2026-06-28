import { prisma } from "@/lib/prisma";

export async function getAppContent(key: string): Promise<Record<string, string>> {
  try {
    const items = await prisma.appContent.findMany({ where: { key } });
    return Object.fromEntries(items.map((i) => [i.type, i.value]));
  } catch {
    return {};
  }
}
