export function formatBeds(beds: number | null | undefined): string {
  if (beds === null || beds === undefined) return "N/A";
  if (beds === 0) return "Studio";
  if (beds >= 5) return "5+";
  return String(beds);
}
