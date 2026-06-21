# Home Area Cards — Admin Control for Locations Section

**Date:** 2026-06-21

## Context

The home page `AreaGrid` component ("Explore Bangkok Areas") currently renders from hardcoded mock data (`HOME_AREA_CARDS` in `app/components/home/mock.ts`). Admin has no way to manage which areas appear, their images, or their order. Listing counts are also static mock numbers.

This spec adds a `HomeAreaCard` DB model and admin CRUD UI so admins can fully control the Locations section. Listing counts become dynamic — computed from published properties in the linked province or district.

## Data Model

New Prisma model added to `prisma/schema.prisma`:

```prisma
model HomeAreaCard {
  id         String    @id @default(cuid())
  name       String
  imageKey   String
  order      Int       @default(0)
  provinceId String?
  province   Province? @relation(fields: [provinceId], references: [id])
  districtId String?
  district   District? @relation(fields: [districtId], references: [id])
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@map("home_area_cards")
}
```

Listing count logic (resolved at API layer):
- `districtId` set → count published properties where `districtId` matches
- else `provinceId` set → count published properties where `provinceId` matches
- else → 0

First card by `order` asc = featured (tall card). Matches existing `AreaGrid` logic (`const [featured, ...rest] = areas`).

## API Routes

### Admin (protected — `authMiddleware` + `adminMiddleware`)

Base path: `/api/admin/home-area-cards`

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | List all cards ordered by `order` asc |
| POST | `/` | Create card |
| PATCH | `/:id` | Update card |
| DELETE | `/:id` | Delete card |

Response includes `province` and `district` relations (`{ id, name, slug }`).

### Public

`GET /api/home-area-cards` — returns all cards with computed `listings` count (single query per card using Prisma `count`).

Response type added to `lib/schema.ts`:
```ts
"home-area-cards": {
  GET: { data: { areaCards: ClientHomeAreaCard[] } };
};
"admin/home-area-cards": {
  GET: { data: { areaCards: HomeAreaCard[] } };
  POST: { data: { areaCard: HomeAreaCard }; body: HomeAreaCardCreateInput };
};
"admin/home-area-cards/:id": {
  PATCH: { data: { areaCard: HomeAreaCard }; params: { id: string }; body: HomeAreaCardUpdateInput };
  DELETE: { data: { ok: true }; params: { id: string } };
};
```

## Validation Schema

New file `validation/homeAreaCardSchema.ts`:

```ts
const homeAreaCardCreateSchema = z.object({
  name: z.string().min(1),
  imageKey: z.string().min(1),
  order: z.number().int().min(0),
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
});

const homeAreaCardUpdateSchema = homeAreaCardCreateSchema.partial();
```

## Types

New file `types/homeAreaCard.ts`:

```ts
export interface HomeAreaCard {
  id: string;
  name: string;
  imageKey: string;
  order: number;
  provinceId: string | null;
  province: { id: string; name: string; slug: string } | null;
  districtId: string | null;
  district: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

export type ClientHomeAreaCard = HomeAreaCard & { listings: number };
```

## Admin UI

Location: `app/(dashboard)/admin/pages/home/` — add a second section "Locations" below the existing HomeSections list. Same page, not a new tab.

**Row display** (`HomeAreaCardRow.tsx`):
- Area name
- Linked geography (province / district name)
- Order number
- Edit / Delete actions

**Form** (`HomeAreaCardForm.tsx`):
- Name input (`RHFInput`)
- Image upload (`RHFFilePicker` → uploads to R2, stores `imageKey`)
- Province dropdown (fetches from `admin/provinces`)
- District dropdown (cascades from selected province; fetches from `admin/locations/districts?provinceId=...`)
- Order number input (`RHFNumberInput`)

Image upload follows existing pattern from media library — upload to R2 via `POST /api/admin/media`, store returned `key`.

## Public AreaGrid

`app/components/home/AreaGrid.tsx` receives props from parent. Parent page switches from mock import to live API call via `useRead("home-area-cards")`. Mock data in `mock.ts` can be removed once live data is wired.

`AreaCard` type gains `listings: number` (already present in type, was previously mock-populated).

## Files to Create

- `prisma/schema.prisma` — add `HomeAreaCard` model
- `validation/homeAreaCardSchema.ts`
- `types/homeAreaCard.ts`
- `hono/routes/homeAreaCards.routes.ts` — admin CRUD
- `hono/routes/publicHomeAreaCards.routes.ts` — public GET with listing counts
- `app/(dashboard)/admin/pages/home/components/HomeAreaCardRow.tsx`
- `app/(dashboard)/admin/pages/home/components/HomeAreaCardForm.tsx`

## Files to Modify

- `hono/index.ts` — register both routes
- `lib/schema.ts` — add API types
- `app/(dashboard)/admin/pages/home/page.tsx` — add Locations section
- `app/components/home/AreaGrid.tsx` parent (home page) — switch to live API data
- `app/components/home/mock.ts` — remove `HOME_AREA_CARDS` (or keep for reference)

## Verification

1. Run `pnpm db:migrate` (user runs this) to apply new model
2. Create 2-3 area cards in admin — verify they appear in Locations section of admin page
3. Visit home page — verify AreaGrid renders live cards in correct order, first card is tall/featured
4. Confirm listing counts reflect actual published properties in linked district/province
5. Edit an area card — verify changes reflect on home page
6. Delete a card — verify it disappears from home page
7. `pnpm lint && pnpm typecheck` — no errors
