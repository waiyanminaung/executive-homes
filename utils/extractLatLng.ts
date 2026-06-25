export function extractLatLng(input: string): { lat: number; lng: number } | null {
  const lng = input.match(/!2d([\d.]+)/)?.[1];
  const lat = input.match(/!3d([\d.-]+)/)?.[1];

  if (!lat || !lng) return null;

  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}
