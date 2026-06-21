import { R2_PUBLIC_URL } from "@/app/constants";

export function getMediaUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}
