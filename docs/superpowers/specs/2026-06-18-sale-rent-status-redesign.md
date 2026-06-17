# Sale & Rent Status Redesign

## Problem

Current `ListingStatus` enum (`FOR_SALE`, `FOR_RENT`, `FOR_SALE_AND_RENT`) mixes two concerns:
- What the property is listed **as** (sale / rent / both)
- What the property's availability **is** (available, sold, rented)

This causes broken badges, broken tab filtering, and a confusing admin UX.

## Solution

Split into two independent fields:

1. **`isForSale` / `isForRent`** — listing type booleans (what it's offered as)
2. **`availabilityStatus`** — current state (`AVAILABLE`, `SOLD`, `RENTED`)

## Schema Changes

**Remove:**
- `ListingStatus` enum (`FOR_SALE`, `FOR_RENT`, `FOR_SALE_AND_RENT`)
- `status ListingStatus` field on `Property`

**Add to `Property`:**
```prisma
isForSale         Boolean           @default(false)
isForRent         Boolean           @default(false)
availabilityStatus AvailabilityStatus @default(AVAILABLE)
```

**New enum:**
```prisma
enum AvailabilityStatus {
  AVAILABLE
  SOLD
  RENTED
}
```

**Migration note:** User must run `pnpm prisma migrate dev` after schema change. Backfill existing data:
- `FOR_SALE` → `isForSale=true, isForRent=false`
- `FOR_RENT` → `isForSale=false, isForRent=true`
- `FOR_SALE_AND_RENT` → `isForSale=true, isForRent=true`
- All existing records → `availabilityStatus=AVAILABLE`

## Validation Schema (`validation/propertySchema.ts`)

Remove `LISTING_STATUSES` + `status` field. Add:

```ts
isForSale: z.boolean(),
isForRent: z.boolean(),
availabilityStatus: z.enum(["AVAILABLE", "SOLD", "RENTED"]),
```

Add refinement: at least one of `isForSale` or `isForRent` must be true.

## Admin Form (`PropertyFormBasicSection.tsx`)

Remove `status` `RHFSelect`. Replace with:

**Listing type section** — label "Listed As", two `RHFSwitch`:
- `isForSale` — "For Sale"
- `isForRent` — "For Rent"

**Availability section** — label "Availability Status", `RHFSelect<string>` with options:
- `AVAILABLE` → "Available"
- `SOLD` → "Sold"
- `RENTED` → "Rented"

## Hono Routes (`hono/routes/properties.routes.ts`)

Update `select` in list query: replace `status` with `isForSale`, `isForRent`, `availabilityStatus`.

Create/update: destructure and pass `isForSale`, `isForRent`, `availabilityStatus` through to Prisma.

## `PropertyItem` Type (`app/types.ts`)

```ts
export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrls: string[];
  listingType: "Sale" | "Rent" | "Sale & Rent";
  availabilityStatus: "AVAILABLE" | "SOLD" | "RENTED";
  beds: number;
  baths: number;
  area: string;
}
```

## Detail Page (`app/properties/[slug]/page.tsx`)

Replace `isRent = raw.status === "FOR_RENT"` with:
- Show sale price when `raw.isForSale`
- Show rent price when `raw.isForRent`
- `listingType`: `raw.isForSale && raw.isForRent ? "Sale & Rent" : raw.isForSale ? "Sale" : "Rent"`

Pass `availabilityStatus` in `PropertyDetail`.

## `PropertyDetailSummary.tsx`

Remove `listingType?: "sale" | "rent"` prop entirely — the `?listing=sale|rent` URL param is no longer needed since booleans directly control which price blocks render. Replace prop logic:
- Show sale price block when `isForSale`
- Show rent price block when `isForRent`
- Show availability badge near title when `availabilityStatus !== "AVAILABLE"` — "SOLD" or "RENTED" pill badge

## Listing Cards / `HomeHero.tsx` + `HomeSearchResults.tsx`

`HomeHero` currently uses `MOCK_PROPERTIES` (not real DB data). Update:
- Mock data type: replace `status: "Sale" | "Rent"` with `listingType` + `availabilityStatus`
- Tab filter: `"rent"` tab → `listingType !== "Sale"` (matches "Rent" and "Sale & Rent"), `"buy"` tab → `listingType !== "Rent"`
- `HomeSearchResults` badge: show `property.listingType`, `/mo` suffix when `listingType !== "Sale"`

## Admin Property Table (`PropertyStatusBadge.tsx` / `PropertyTable.tsx`)

Update badge to derive from `isForSale` + `isForRent` + `availabilityStatus`.

## Files Touched

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Remove `ListingStatus` enum, add `isForSale`, `isForRent`, `AvailabilityStatus` enum, `availabilityStatus` |
| `validation/propertySchema.ts` | Replace `status` with `isForSale`, `isForRent`, `availabilityStatus` |
| `app/types.ts` | Update `PropertyItem`: replace `status` with `listingType` + `availabilityStatus` |
| `app/properties/[slug]/page.tsx` | Use `isForSale`/`isForRent` for price logic |
| `app/properties/[slug]/types.ts` | Add `isForSale`, `isForRent`, `availabilityStatus` to `PropertyDetail` |
| `app/properties/[slug]/components/PropertyDetailSummary.tsx` | Use boolean flags + show availability badge |
| `app/components/home/HomeHero.tsx` | Update mock filter logic |
| `app/components/home/HomeSearchResults.tsx` | Update badge + `/mo` logic |
| `app/(dashboard)/admin/properties/components/PropertyFormBasicSection.tsx` | Replace status select with switches + availability select |
| `hono/routes/properties.routes.ts` | Update select + create/update fields |
| `app/(dashboard)/admin/properties/components/PropertyStatusBadge.tsx` | Derive badge from new fields |
| `app/(dashboard)/admin/properties/components/PropertyTable.tsx` | Pass new fields to badge |
