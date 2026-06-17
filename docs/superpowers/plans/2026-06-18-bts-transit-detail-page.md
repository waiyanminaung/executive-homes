# BTS Transit Info — Property Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show nearby BTS/MRT transit station info on the public property detail page, with distance auto-calculated via Haversine from property + station lat/lng.

**Architecture:** Pure server-side calculation in `page.tsx` — property and station lat/lng already fetched via Prisma include. Transit rows rendered in `PropertyDetailSummary` below the stats grid. No external API, no client fetching.

**Tech Stack:** Next.js 16, TypeScript, Prisma, Tailwind CSS, lucide-react, `TRANSIT_LINE_COLORS`/`TRANSIT_LINE_LABELS` from `@/constants/transitStations`

## Global Constraints

- Never use `any` type — proper interfaces only
- No comments unless WHY is non-obvious
- `classNames` util from `@/utils/classNames` for multiple className values
- `lucide-react` for all icons
- Run `pnpm lint && pnpm typecheck` before each commit
- Never use `useMemo` or `useCallback`
- No `useEffect` for data
- Max ~200 lines per component file

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `utils/haversine.ts` | Create | Pure Haversine distance calculation |
| `app/properties/[slug]/types.ts` | Modify | Add `PropertyTransitItem`, extend `PropertyDetail` |
| `app/properties/[slug]/page.tsx` | Modify | Map raw transit data, compute Haversine distance |
| `app/properties/[slug]/components/PropertyDetailSummary.tsx` | Modify | Render transit rows below stats grid |
| `app/(dashboard)/admin/properties/components/PropertyFormTransitSection.tsx` | Modify | Hide `distanceMeters` input |

---

### Task 1: Haversine utility

**Files:**
- Create: `utils/haversine.ts`

**Interfaces:**
- Produces: `haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number`

- [ ] **Step 1: Create `utils/haversine.ts`**

```typescript
const EARTH_RADIUS_METERS = 6_371_000;

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return Math.round(EARTH_RADIUS_METERS * 2 * Math.asin(Math.sqrt(a)));
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add utils/haversine.ts
git commit -m "feat: add haversine distance utility"
```

---

### Task 2: Add transit types

**Files:**
- Modify: `app/properties/[slug]/types.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  ```ts
  interface PropertyTransitItem {
    stationId: string;
    code: string | null;
    name: string;
    line: string;
    calculatedMeters: number | null;
  }
  // PropertyDetail gains: transitStations: PropertyTransitItem[]
  ```

- [ ] **Step 1: Add `PropertyTransitItem` and extend `PropertyDetail`**

Replace entire `app/properties/[slug]/types.ts` with:

```typescript
import type { LucideIcon } from "lucide-react";
import type { PropertyItem } from "@/app/types";

export interface PropertyDetailStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface PropertyAmenity {
  label: string;
  icon: LucideIcon;
}

export interface PropertyContactItem {
  label: string;
  iconUrl: string;
}

export interface PropertyTransitItem {
  stationId: string;
  code: string | null;
  name: string;
  line: string;
  calculatedMeters: number | null;
}

export interface PropertyDetail extends PropertyItem {
  salePrice: number;
  rentPrice: number;
  address: string;
  description: string;
  detailStats: PropertyDetailStat[];
  unitFeatures: PropertyAmenity[];
  commonFacilities: PropertyAmenity[];
  mapImageUrl: string;
  transitStations: PropertyTransitItem[];
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: errors only in `page.tsx` — `transitStations` not yet mapped (expected, fixed in Task 3)

- [ ] **Step 3: Commit**

```bash
git add app/properties/\[slug\]/types.ts
git commit -m "feat: add PropertyTransitItem type to property detail"
```

---

### Task 3: Map transit data in page.tsx

**Files:**
- Modify: `app/properties/[slug]/page.tsx`

**Interfaces:**
- Consumes: `haversineMeters` from `@/utils/haversine`, `PropertyTransitItem` from `./types`
- Produces: `property.transitStations: PropertyTransitItem[]` passed to `PropertyDetailSummary`

- [ ] **Step 1: Import haversine util**

At top of `app/properties/[slug]/page.tsx`, add import after existing imports:

```typescript
import { haversineMeters } from "@/utils/haversine";
```

- [ ] **Step 2: Map transit stations with Haversine calc**

Inside `PropertyDetailPage`, after the `commonFacilities` mapping and before the `property` object construction, add:

```typescript
const transitStations = raw.transitStations.map((pt) => {
  const hasCoords =
    raw.lat != null &&
    raw.lng != null &&
    pt.station.lat != null &&
    pt.station.lng != null;

  const calculatedMeters = hasCoords
    ? haversineMeters(raw.lat!, raw.lng!, pt.station.lat!, pt.station.lng!)
    : null;

  return {
    stationId: pt.stationId,
    code: pt.station.code ?? null,
    name: pt.station.name,
    line: pt.station.line,
    calculatedMeters,
  };
});
```

- [ ] **Step 3: Add `transitStations` to the `property` object**

Inside the `property: PropertyDetail = { ... }` object, add:

```typescript
transitStations,
```

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: no errors (type now satisfied)

- [ ] **Step 5: Commit**

```bash
git add app/properties/\[slug\]/page.tsx
git commit -m "feat: map transit stations with haversine distance in property detail page"
```

---

### Task 4: Render transit section in PropertyDetailSummary

**Files:**
- Modify: `app/properties/[slug]/components/PropertyDetailSummary.tsx`

**Interfaces:**
- Consumes: `property.transitStations: PropertyTransitItem[]` from `PropertyDetail`
- Consumes: `TRANSIT_LINE_COLORS`, `TRANSIT_LINE_LABELS` from `@/constants/transitStations`
- Consumes: `PropertyTransitItem` from `../types`

Display rules:
- `calculatedMeters !== null` → `"{meters} m ({mins} mins) from {code} {name}"`
- `calculatedMeters === null` → `"Near {code} {name}"`
- `code` may be null → omit code prefix if null
- Only render section if `transitStations.length > 0`
- Walking minutes: `Math.round(calculatedMeters / 80)`

- [ ] **Step 1: Add imports to `PropertyDetailSummary.tsx`**

Add to existing imports:

```typescript
import { TRANSIT_LINE_COLORS, TRANSIT_LINE_LABELS } from "@/constants/transitStations";
import type { PropertyTransitItem } from "../types";
import type { TransitLine } from "@/constants/transitStations";
```

- [ ] **Step 2: Add `TransitRow` helper component above `PropertyDetailSummary`**

```typescript
function TransitRow({ station }: { station: PropertyTransitItem }) {
  const color = TRANSIT_LINE_COLORS[station.line as TransitLine];
  const stationLabel = station.code ? `${station.code} ${station.name}` : station.name;

  const distanceText =
    station.calculatedMeters !== null
      ? `${station.calculatedMeters} m (${Math.round(station.calculatedMeters / 80)} mins) from ${stationLabel}`
      : `Near ${stationLabel}`;

  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-neutral-700">{distanceText}</span>
    </div>
  );
}
```

- [ ] **Step 3: Render transit section inside `PropertyDetailSummary`**

After the closing `</dl>` of the stats grid and before the closing `</section>`, add:

```typescript
{property.transitStations.length > 0 && (
  <>
    <div className="my-5 h-px bg-gray-300" />
    <div className="space-y-2.5">
      {property.transitStations.map((station) => (
        <TransitRow key={station.stationId} station={station} />
      ))}
    </div>
  </>
)}
```

- [ ] **Step 4: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/properties/\[slug\]/components/PropertyDetailSummary.tsx
git commit -m "feat: render transit station rows in property detail summary"
```

---

### Task 5: Hide distance input from admin form

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormTransitSection.tsx`

- [ ] **Step 1: Remove `distanceMeters` input block**

In `PropertyFormTransitSection.tsx`, inside the `.map()` for fields, remove the entire `RHFNumberInput` block:

```typescript
// REMOVE this block:
<div className="w-36 space-y-1.5">
  <RHFNumberInput
    name={`transitStations.${index}.distanceMeters`}
    placeholder="500"
    suffix="m"
    min={1}
    max={9999}
  />
  <RHFError name={`transitStations.${index}.distanceMeters`} />
</div>
```

- [ ] **Step 2: Remove unused imports**

If `RHFNumberInput` is no longer used anywhere in the file, remove it from the import:

```typescript
// Before:
import { RHFError, RHFNumberInput } from "@geckoui/geckoui";

// After:
import { RHFError } from "@geckoui/geckoui";
```

- [ ] **Step 3: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/properties/components/PropertyFormTransitSection.tsx
git commit -m "feat: hide manual distance input from transit section (now auto-calculated)"
```
