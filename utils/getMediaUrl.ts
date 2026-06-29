import { R2_PUBLIC_URL } from "@/lib/r2";

export function getMediaUrl(key: string): string {
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  return `${R2_PUBLIC_URL}/${key}`;
}
