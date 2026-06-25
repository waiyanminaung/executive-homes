export function getMinPrice(tiers: { salePrice: number | null; rentPrice: number | null }[]): number {
  const prices = tiers.flatMap((t) => [t.salePrice, t.rentPrice]).filter((v): v is number => v !== null);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

export function getMinSalePrice(
  tiers: { salePrice: number | null }[],
  isForSale: boolean,
): number | null {
  if (!isForSale) return null;
  const prices = tiers.map((t) => t.salePrice).filter((v): v is number => v !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export function getMinRentPrice(
  tiers: { rentPrice: number | null }[],
  isForRent: boolean,
): number | null {
  if (!isForRent) return null;
  const prices = tiers.map((t) => t.rentPrice).filter((v): v is number => v !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}
