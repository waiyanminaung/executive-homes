# BTS Transit Info on Property Detail Page

## Goal

Show nearby transit station info on the public property detail page so visitors can quickly assess commute convenience.

## Data Model

Both `Property` and `TransitStation` have nullable `lat Float?` / `lng Float?` in the DB.
`PropertyTransit` join table has `distanceMeters Int` — kept in DB as silent fallback, hidden from admin UI.

## Distance Calculation

Use Haversine formula (pure math, no external API) computed server-side in `page.tsx`.

- Both property and station lat/lng present → calculate meters, derive walk minutes
- Either lat/lng missing → fallback to "Near" label (no distance shown)

Walking time: `Math.round(distanceMeters / 80)` — 80 m/min average walking speed.

## Display

Rendered inside `PropertyDetailSummary`, below the stats grid (`<dl>`), separated by a divider. Only renders when `transitStations.length > 0`.

Each row format:

- **With coords**: `[colored square] 840 m (10 mins) from S1 Rachadamri BTS`
- **Without coords**: `[colored square] Near S1 Rachadamri BTS`

Colored square uses `TRANSIT_LINE_COLORS[station.line]` — matches admin form badge styling.
Station display: `{code} {name}` — e.g. "S1 Rachadamri BTS".

Max 2 stations per property (current data constraint).

## Admin Form Change

Hide the `distanceMeters` `RHFNumberInput` from `PropertyFormTransitSection`. The DB column stays — no migration required.

## Files

| File | Change |
|------|--------|
| `utils/haversine.ts` | New pure util: `haversineMeters(lat1, lng1, lat2, lng2): number` |
| `app/properties/[slug]/types.ts` | Add `transitStations: PropertyTransitItem[]` to `PropertyDetail` |
| `app/properties/[slug]/page.tsx` | Map `raw.transitStations`, compute Haversine distance |
| `app/properties/[slug]/components/PropertyDetailSummary.tsx` | Render transit rows below stats grid |
| `app/(dashboard)/admin/properties/components/PropertyFormTransitSection.tsx` | Hide distance input |

## Type

```ts
interface PropertyTransitItem {
  stationId: string;
  code: string | null;
  name: string;
  line: string;
  calculatedMeters: number | null;
}
```

`calculatedMeters` = Haversine result. `null` when either property or station lat/lng is missing. Distinct from the DB `PropertyTransit.distanceMeters` column which is not used for display.

## Edge Cases

- No transit stations → transit section not rendered
- Coords missing on property or station → show "Near {code} {name}" row
- `distanceMeters` stored in DB is not shown to visitors — Haversine only
