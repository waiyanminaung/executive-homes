export function getMinPrice(tiers: { salePrice: number | null; rentPrice: number | null }[]): number {
  const prices = tiers.flatMap((t) => [t.salePrice, t.rentPrice]).filter((v): v is number => v !== null);
  return prices.length > 0 ? Math.min(...prices) : 0;
}
