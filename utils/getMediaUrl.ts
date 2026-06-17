import { R2_PUBLIC_URL } from "@/lib/r2";

export function getMediaUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}
