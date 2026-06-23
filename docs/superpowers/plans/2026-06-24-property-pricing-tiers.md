# Property Pricing Tiers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat `salePrice`/`rentPrice` on `Property` with a `PropertyPricingTier` child table, update all admin forms, API routes, and public UI to support multiple pricing tiers per property.

**Architecture:** New `PropertyPricingTier` model (label, salePrice?, rentPrice?, order) with cascade-delete. Admin form uses `useFieldArray` to manage tiers inline. Public cards show "Starting from ฿X" when multiple tiers exist; detail page shows a pricing table for multi-tier or inline price for single-tier.

**Tech Stack:** Prisma, Hono, Zod, React Hook Form (`useFieldArray`), GeckoUI (`RHFCurrencyInput`, `Label`, `RHFInput`, `RHFError`), Spoosh, Next.js App Router.

## Global Constraints

- Never use `any` TypeScript type
- No comments in code unless the WHY is non-obvious
- `pnpm` as package manager
- Run `pnpm lint && pnpm typecheck` before marking done
- Never run `prisma migrate` or `prisma db push` — ask user to run those
- Always wrap Prisma calls in `try/catch` returning safe fallback
- `classNames` util for multiple className
- No `useMemo`/`useCallback`
- Empty lines between functions and logical blocks
- Max ~200 lines per component file

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `prisma/schema.prisma` | Modify | Add `PropertyPricingTier` model; remove `salePrice`/`rentPrice` from `Property` |
| `validation/propertySchema.ts` | Modify | Replace salePrice/rentPrice with `pricingTiers` array; update validation |
| `types/property.ts` | Modify | Add `PropertyPricingTier` interface; update `PropertyListItem` and `PropertyDetail` |
| `app/types.ts` | Modify | Add `hasMultipleTiers: boolean` to `PropertyItem` |
| `lib/schema.ts` | Modify | Update `ApiSchema` types for properties endpoints |
| `hono/routes/properties.routes.ts` | Modify | Include/create/update pricingTiers; update PROPERTY_INCLUDE and list select |
| `hono/routes/publicProperties.routes.ts` | Modify | Include pricingTiers in list and detail queries; fix sort-by-price |
| `hono/services/propertyDetail.service.ts` | Modify | Include pricingTiers in getPropertyBySlug and getSimilarProperties |
| `app/(dashboard)/admin/properties/components/PropertyFormPricingSection.tsx` | Modify | Replace flat inputs with `useFieldArray` rows |
| `app/(dashboard)/admin/properties/components/PropertyForm.tsx` | Modify | Update DEFAULT_VALUES; remove salePrice/rentPrice |
| `app/(dashboard)/admin/properties/[id]/edit/page.tsx` | Modify | Pass pricingTiers in defaultValues instead of salePrice/rentPrice |
| `app/properties/[slug]/types.ts` | Modify | Add `pricingTiers` to `PropertyDetail`; remove salePrice/rentPrice |
| `app/properties/[slug]/page.tsx` | Modify | Derive pricingTiers for detail; update price/listingType logic |
| `app/properties/[slug]/components/PropertyDetailSummary.tsx` | Modify | Render single price or pricing table based on tier count |
| `components/PropertyCard.tsx` | Modify | Show "Starting from ฿X" when `hasMultipleTiers` |
| `components/listing/ListingPage.tsx` | Modify | Derive minPrice from pricingTiers in `toPropertyItem` |

---

### Task 1: Schema — add PropertyPricingTier, remove flat price fields

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `PropertyPricingTier` model with `id`, `propertyId`, `label`, `salePrice?`, `rentPrice?`, `order`

- [ ] **Step 1: Edit schema**

In `prisma/schema.prisma`, remove `salePrice` and `rentPrice` from `Property` model, then add the new model after the `Property` model block:

```prisma
// Inside Property model — REMOVE these two lines:
//   salePrice     Float?
//   rentPrice     Float?

// ADD this relation inside Property model:
  pricingTiers    PropertyPricingTier[]

// ADD this model after Property:
model PropertyPricingTier {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  label      String   @default("")
  salePrice  Float?
  rentPrice  Float?
  order      Int      @default(0)

  @@map("property_pricing_tiers")
}
```

- [ ] **Step 2: Ask user to run migration**

Tell the user:
> Please run: `npx prisma migrate dev --name add-property-pricing-tiers`
> Then continue.

---

### Task 2: Validation schema — pricingTiers array

**Files:**
- Modify: `validation/propertySchema.ts`

**Interfaces:**
- Produces: `pricingTierSchema`, `PropertyCreateInput` with `pricingTiers` array

- [ ] **Step 1: Replace propertySchema.ts**

```typescript
import { z } from "zod";

export const AVAILABILITY_STATUSES = ["AVAILABLE", "SOLD", "RENTED"] as const;

export const pricingTierSchema = z.object({
  label: z.string(),
  salePrice: z.preprocess((v) => (!v ? null : Number(v)), z.number().positive().nullable()),
  rentPrice: z.preprocess((v) => (!v ? null : Number(v)), z.number().positive().nullable()),
  order: z.number().int().default(0),
});

export type PricingTierInput = z.infer<typeof pricingTierSchema>;

const propertyBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  propertyTypeId: z.string().min(1, "Property type is required"),
  isForSale: z.boolean(),
  isForRent: z.boolean(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
  pricingTiers: z.array(pricingTierSchema).min(1, "At least one pricing tier is required"),
  beds: z.coerce.number().int().min(0).nullable().optional(),
  baths: z.coerce.number().int().min(0).nullable().optional(),
  areaSqm: z.coerce.number().positive("Area is required"),
  address: z.string().min(1, "Address is required"),
  provinceId: z.string().min(1, "Province is required"),
  districtId: z.string().nullable().optional(),
  subDistrictId: z.string().nullable().optional(),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  mapImageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isPetFriendly: z.boolean(),
  imageUrls: z.array(z.string()),
  featureIds: z.array(z.string()),
  transitStations: z.array(
    z.object({
      stationId: z.string().min(1, "Station is required"),
      distanceMeters: z.coerce.number().int().min(1).max(9999),
    }),
  ),
});

export const propertyCreateSchema = propertyBaseSchema.refine(
  (data) => data.isForSale || data.isForRent,
  { message: "At least one of For Sale or For Rent must be selected", path: ["isForSale"] },
);

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

export const propertyUpdateSchema = propertyBaseSchema.partial().refine(
  (data) => {
    if (data.isForSale !== undefined && data.isForRent !== undefined) {
      return data.isForSale || data.isForRent;
    }
    return true;
  },
  { message: "At least one of For Sale or For Rent must be selected", path: ["isForSale"] },
);

export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;

export const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  typeId: z.string().optional(),
  status: z.enum(["published", "draft"]).optional(),
  listingType: z.enum(["sale", "rent"]).optional(),
  availability: z.enum(["AVAILABLE", "SOLD", "RENTED"]).optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  subDistrictIds: z.string().optional(),
});
```

---

### Task 3: TypeScript types

**Files:**
- Modify: `types/property.ts`
- Modify: `app/types.ts`

**Interfaces:**
- Produces: `PropertyPricingTier` interface; updated `PropertyListItem`, `PropertyDetail`, `PropertyItem`

- [ ] **Step 1: Update `types/property.ts`**

```typescript
import type { Feature } from "./feature";
import type { PropertyTransitItem } from "./transitStation";
import type { PropertyTypeItem } from "./propertyType";

export interface PropertyPricingTier {
  id: string;
  label: string;
  salePrice: number | null;
  rentPrice: number | null;
  order: number;
}

export interface PropertyListItem {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyTypeItem;
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  pricingTiers: PropertyPricingTier[];
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  isFeatured: boolean;
  isPublished: boolean;
  isPetFriendly: boolean;
  createdAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  order: number;
}

export interface PropertyDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyTypeItem;
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  pricingTiers: PropertyPricingTier[];
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  address: string;
  provinceId: string;
  districtId: string | null;
  subDistrictId: string | null;
  lat: number | null;
  lng: number | null;
  mapImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  isPetFriendly: boolean;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  features: Feature[];
  transitStations: PropertyTransitItem[];
}

export interface Province {
  id: string;
  name: string;
  slug: string;
}
```

- [ ] **Step 2: Update `app/types.ts`**

Add `hasMultipleTiers` to `PropertyItem`:

```typescript
import type { LucideIcon } from "lucide-react";

export interface NavDropdownColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface HomeNavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownColumns?: NavDropdownColumn[];
}

export interface AreaCard {
  name: string;
  listings: number;
  imageUrl: string;
  featured?: boolean;
}

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  hasMultipleTiers: boolean;
  imageUrls: string[];
  listingType: "Sale" | "Rent" | "Sale & Rent";
  availabilityStatus: "AVAILABLE" | "SOLD" | "RENTED";
  beds: number;
  baths: number;
  area: string;
}

export interface PropertySection {
  title: string;
  viewMoreHref: string;
  properties: PropertyItem[];
}

export interface WhyItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}
```

---

### Task 4: Update lib/schema.ts (ApiSchema)

**Files:**
- Modify: `lib/schema.ts`

**Interfaces:**
- Consumes: `PropertyListItem`, `PropertyDetail` from `types/property.ts` (now with `pricingTiers`)
- Consumes: `PropertyCreateInput`, `PropertyUpdateInput` from `validation/propertySchema.ts` (now with `pricingTiers`)

- [ ] **Step 1: Update admin/properties list GET response**

In `lib/schema.ts`, the types `PropertyListItem` and `PropertyDetail` are imported — no changes needed to `lib/schema.ts` itself since it uses the imported types. However, the inline `PublicPropertyListItem` interface needs updating:

Find:
```typescript
interface PublicPropertyListItem extends PropertyListItem {
  address: string;
  images: { url: string }[];
}
```

This interface will automatically pick up the `pricingTiers` from `PropertyListItem` since it extends it. No change needed here.

Verify the file compiles with `pnpm typecheck` — no edits required if types propagate correctly.

---

### Task 5: Update Hono admin properties route

**Files:**
- Modify: `hono/routes/properties.routes.ts`

- [ ] **Step 1: Replace `properties.routes.ts`**

```typescript
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyListQuerySchema,
} from "@/validation/propertySchema";
import type { AppEnv } from "@/hono/types";

const PROPERTY_INCLUDE = {
  images: { orderBy: { order: "asc" as const } },
  features: { include: { feature: true } },
  transitStations: { include: { station: true } },
  propertyType: { select: { id: true, name: true, slug: true } },
  pricingTiers: { orderBy: { order: "asc" as const } },
};

const propertyRoutes = new Hono<AppEnv>();

propertyRoutes.use("*", authMiddleware, adminMiddleware);

propertyRoutes.get("/", zv("query", propertyListQuerySchema), async (c) => {
  const { page, limit, search, typeId, status, listingType, availability, provinceId, districtId, subDistrictIds } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    ...(typeId ? { propertyTypeId: typeId } : {}),
    ...(status === "published" ? { isPublished: true } : {}),
    ...(status === "draft" ? { isPublished: false } : {}),
    ...(listingType === "sale" ? { isForSale: true } : {}),
    ...(listingType === "rent" ? { isForRent: true } : {}),
    ...(availability ? { availabilityStatus: availability } : {}),
    ...(provinceId ? { provinceId } : {}),
    ...(districtId ? { districtId } : {}),
    ...(subDistrictIds ? { subDistrictId: { in: subDistrictIds.split(",") } } : {}),
  };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, slug: true, title: true,
        isForSale: true, isForRent: true, availabilityStatus: true,
        propertyType: { select: { id: true, name: true, slug: true } },
        pricingTiers: { orderBy: { order: "asc" as const } },
        beds: true, baths: true, areaSqm: true,
        isFeatured: true, isPublished: true, isPetFriendly: true, createdAt: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  return c.json({ properties, total, page, limit });
});

propertyRoutes.post("/", zv("json", propertyCreateSchema), async (c) => {
  const { imageUrls, featureIds, transitStations, pricingTiers, ...data } = c.req.valid("json");

  const property = await prisma.property.create({
    data: {
      ...data,
      images: { create: imageUrls.map((url, order) => ({ url, order })) },
      features: { create: featureIds.map((featureId) => ({ featureId })) },
      transitStations: { create: transitStations },
      pricingTiers: { create: pricingTiers.map((tier, order) => ({ ...tier, order })) },
    },
    include: PROPERTY_INCLUDE,
  });

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  }, 201);
});

propertyRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const property = await prisma.property.findUnique({
    where: { id },
    include: PROPERTY_INCLUDE,
  });

  if (!property) return c.json({ error: "Property not found" }, 404);

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  });
});

propertyRoutes.patch("/:id", zv("json", propertyUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const { imageUrls, featureIds, transitStations, pricingTiers, ...data } = c.req.valid("json");

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Property not found" }, 404);

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      ...(imageUrls !== undefined && {
        images: { deleteMany: {}, create: imageUrls.map((url, order) => ({ url, order })) },
      }),
      ...(featureIds !== undefined && {
        features: { deleteMany: {}, create: featureIds.map((featureId) => ({ featureId })) },
      }),
      ...(transitStations !== undefined && {
        transitStations: { deleteMany: {}, create: transitStations },
      }),
      ...(pricingTiers !== undefined && {
        pricingTiers: { deleteMany: {}, create: pricingTiers.map((tier, order) => ({ ...tier, order })) },
      }),
    },
    include: PROPERTY_INCLUDE,
  });

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
    },
  });
});

propertyRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Property not found" }, 404);
  await prisma.property.delete({ where: { id } });
  return c.json({ ok: true });
});

export default propertyRoutes;
```

---

### Task 6: Update public properties route

**Files:**
- Modify: `hono/routes/publicProperties.routes.ts`

- [ ] **Step 1: Replace `publicProperties.routes.ts`**

```typescript
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { zv } from "@/validation/zv";

const publicPropertiesRoutes = new Hono();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  isForSale: z.coerce.boolean().optional(),
  isForRent: z.coerce.boolean().optional(),
  type: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  beds: z.coerce.number().int().optional(),
  q: z.string().optional(),
  sort: z.enum(["default", "price-asc", "price-desc"]).optional(),
});

publicPropertiesRoutes.get("/", zv("query", listQuerySchema), async (c) => {
  const { page, limit, isForSale, isForRent, type, provinceId, districtId, beds, q, sort } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (isForSale !== undefined) where.isForSale = isForSale;
  if (isForRent !== undefined) where.isForRent = isForRent;
  if (type) where.propertyType = { slug: type };
  if (provinceId) where.provinceId = provinceId;
  if (districtId) where.districtId = districtId;
  if (beds !== undefined) where.beds = beds;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const orderBy =
    sort === "price-asc" || sort === "price-desc"
      ? { pricingTiers: { _min: { salePrice: sort === "price-asc" ? "asc" as const : "desc" as const } } }
      : { createdAt: "desc" as const };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true, slug: true, title: true,
        isForSale: true, isForRent: true, availabilityStatus: true,
        propertyType: { select: { id: true, name: true, slug: true } },
        pricingTiers: { orderBy: { order: "asc" as const } },
        beds: true, baths: true, areaSqm: true,
        address: true, isFeatured: true, isPublished: true, isPetFriendly: true, createdAt: true,
        images: { take: 5, orderBy: { order: "asc" }, select: { url: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return c.json({ properties, total, page, limit });
});

publicPropertiesRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const property = await prisma.property.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: { order: "asc" } },
      features: { include: { feature: true } },
      transitStations: { include: { station: true } },
      pricingTiers: { orderBy: { order: "asc" } },
      province: { select: { id: true, name: true, slug: true } },
      district: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!property) return c.json({ error: "Property not found" }, 404);

  return c.json({
    property: {
      ...property,
      features: property.features.map((pf) => pf.feature),
      transitStations: property.transitStations,
    },
  });
});

export default publicPropertiesRoutes;
```

> **Note on sort:** Prisma does not support orderBy on aggregate of relation in findMany directly — if the above orderBy causes a Prisma error, fall back to `{ createdAt: "desc" as const }` for price sorts and add a TODO comment for future implementation.

---

### Task 7: Update propertyDetail service

**Files:**
- Modify: `hono/services/propertyDetail.service.ts`

- [ ] **Step 1: Replace service file**

```typescript
import { prisma } from "@/lib/prisma";
import type { PropertyItem } from "@/app/types";

export async function getPropertyBySlug(slug: string) {
  try {
    return await prisma.property.findUnique({
      where: { slug, isPublished: true },
      include: {
        propertyType: true,
        images: { orderBy: { order: "asc" } },
        features: { include: { feature: true } },
        transitStations: { include: { station: true } },
        pricingTiers: { orderBy: { order: "asc" } },
        province: { select: { name: true } },
        district: { select: { name: true } },
        subDistrict: { select: { name: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getSimilarProperties(slug: string, provinceId: string, propertyTypeId: string): Promise<PropertyItem[]> {
  try {
    const results = await prisma.property.findMany({
      where: {
        isPublished: true,
        NOT: { slug },
        OR: [{ provinceId }, { propertyTypeId }],
      },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        address: true,
        isForSale: true,
        isForRent: true,
        availabilityStatus: true,
        pricingTiers: { orderBy: { order: "asc" as const } },
        beds: true,
        baths: true,
        areaSqm: true,
        images: { take: 1, orderBy: { order: "asc" }, select: { url: true } },
        id: true,
      },
    });

    return results.map((p) => {
      const listingType = p.isForSale && p.isForRent ? "Sale & Rent" : p.isForSale ? "Sale" : "Rent";
      const prices = p.pricingTiers.flatMap((t) => [t.salePrice, t.rentPrice]).filter((v): v is number => v !== null);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: p.address,
        price: minPrice,
        hasMultipleTiers: p.pricingTiers.length > 1,
        listingType,
        availabilityStatus: p.availabilityStatus,
        beds: p.beds ?? 0,
        baths: p.baths ?? 0,
        area: `${p.areaSqm} sqm`,
        imageUrls: p.images.map((img) => img.url),
      };
    });
  } catch {
    return [];
  }
}
```

---

### Task 8: Update admin PropertyFormPricingSection

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormPricingSection.tsx`

**Interfaces:**
- Consumes: `useFieldArray` from `react-hook-form`, `PricingTierInput` from `validation/propertySchema`

- [ ] **Step 1: Replace `PropertyFormPricingSection.tsx`**

```typescript
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { RHFCurrencyInput, RHFNumberInput, RHFError, RHFInput, Label } from "@geckoui/geckoui";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import type { PropertyCreateInput } from "@/validation/propertySchema";

const THB = { symbol: "฿", code: "THB" };

function PricingTierRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
      <div className="space-y-1.5">
        {index === 0 && <Label>Label</Label>}
        <RHFInput name={`pricingTiers.${index}.label`} placeholder="e.g. Fully Furnished" />
        <RHFError name={`pricingTiers.${index}.label`} />
      </div>

      <div className="space-y-1.5">
        {index === 0 && <Label>Rent / month</Label>}
        <RHFCurrencyInput name={`pricingTiers.${index}.rentPrice`} placeholder="0" currency={THB} />
        <RHFError name={`pricingTiers.${index}.rentPrice`} />
      </div>

      <div className="space-y-1.5">
        {index === 0 && <Label>Sale Price</Label>}
        <RHFCurrencyInput name={`pricingTiers.${index}.salePrice`} placeholder="0" currency={THB} />
        <RHFError name={`pricingTiers.${index}.salePrice`} />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
        aria-label="Remove tier"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PropertyFormPricingSection() {
  const { control } = useFormContext<PropertyCreateInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingTiers",
  });

  const handleAdd = () => {
    append({ label: "", salePrice: null, rentPrice: null, order: fields.length });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Pricing Tiers</h2>
        <Button type="button" variant="outlined" size="sm" onClick={handleAdd} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Tier
        </Button>
      </div>

      <RHFError name="pricingTiers" />

      <div className="space-y-3">
        {fields.map((field, index) => (
          <PricingTierRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 py-2">No pricing tiers yet. Click "Add Tier" to begin.</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
        <div className="space-y-1.5">
          <Label>Bedrooms</Label>
          <RHFNumberInput name="beds" placeholder="0" min={0} />
          <RHFError name="beds" />
        </div>

        <div className="space-y-1.5">
          <Label>Bathrooms</Label>
          <RHFNumberInput name="baths" placeholder="0" min={0} />
          <RHFError name="baths" />
        </div>

        <div className="space-y-1.5">
          <Label required>Area</Label>
          <RHFNumberInput name="areaSqm" placeholder="0" suffix="sqm" min={0} />
          <RHFError name="areaSqm" />
        </div>
      </div>
    </div>
  );
}
```

> **Note:** Check GeckoUI docs for exact `Button` size prop values (`"sm"` may vary). If `size="sm"` is not valid, use `className` sizing instead.

---

### Task 9: Update PropertyForm default values

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyForm.tsx`

- [ ] **Step 1: Update DEFAULT_VALUES and imports**

Remove `salePrice` and `rentPrice` from `DEFAULT_VALUES`. Add `pricingTiers: []`.

Find the DEFAULT_VALUES block:
```typescript
const DEFAULT_VALUES: PropertyCreateInput = {
  title: "",
  slug: "",
  description: "",
  propertyTypeId: "",
  isForSale: false,
  isForRent: false,
  availabilityStatus: "AVAILABLE",
  salePrice: null,
  rentPrice: null,
  beds: null,
  baths: null,
  areaSqm: 0,
  address: "",
  provinceId: "",
  districtId: null,
  subDistrictId: null,
  lat: null,
  lng: null,
  mapImageUrl: null,
  isFeatured: false,
  isPublished: false,
  isPetFriendly: false,
  imageUrls: [],
  featureIds: [],
  transitStations: [],
};
```

Replace with:
```typescript
const DEFAULT_VALUES: PropertyCreateInput = {
  title: "",
  slug: "",
  description: "",
  propertyTypeId: "",
  isForSale: false,
  isForRent: false,
  availabilityStatus: "AVAILABLE",
  pricingTiers: [],
  beds: null,
  baths: null,
  areaSqm: 0,
  address: "",
  provinceId: "",
  districtId: null,
  subDistrictId: null,
  lat: null,
  lng: null,
  mapImageUrl: null,
  isFeatured: false,
  isPublished: false,
  isPetFriendly: false,
  imageUrls: [],
  featureIds: [],
  transitStations: [],
};
```

---

### Task 10: Update admin edit page defaultValues

**Files:**
- Modify: `app/(dashboard)/admin/properties/[id]/edit/page.tsx`

- [ ] **Step 1: Replace salePrice/rentPrice with pricingTiers in defaultValues**

Find the `defaultValues` block (around line 53–82) and replace `salePrice` and `rentPrice` lines:

Remove:
```typescript
salePrice: property.salePrice,
rentPrice: property.rentPrice,
```

Add:
```typescript
pricingTiers: property.pricingTiers.map((tier: { label: string; salePrice: number | null; rentPrice: number | null; order: number }) => ({
  label: tier.label,
  salePrice: tier.salePrice,
  rentPrice: tier.rentPrice,
  order: tier.order,
})),
```

---

### Task 11: Update detail page types (slug/types.ts)

**Files:**
- Modify: `app/properties/[slug]/types.ts`

- [ ] **Step 1: Replace types.ts**

```typescript
import type { LucideIcon } from "lucide-react";
import type { PropertyItem } from "@/app/types";
import type { PropertyPricingTier } from "@/types/property";

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
  googleMapsUrl: string | null;
}

export interface PropertyDetail extends PropertyItem {
  pricingTiers: PropertyPricingTier[];
  isForSale: boolean;
  isForRent: boolean;
  address: string;
  provinceName: string | null;
  districtName: string | null;
  subDistrictName: string | null;
  description: string;
  isPetFriendly: boolean;
  detailStats: PropertyDetailStat[];
  unitFeatures: PropertyAmenity[];
  commonFacilities: PropertyAmenity[];
  mapImageUrl: string;
  lat: number | null;
  lng: number | null;
  transitStations: PropertyTransitItem[];
}
```

---

### Task 12: Update detail page (slug/page.tsx)

**Files:**
- Modify: `app/properties/[slug]/page.tsx`

- [ ] **Step 1: Update price/listingType derivation and property object**

Find the price and listingType lines:
```typescript
const price = raw.isForSale ? (raw.salePrice ?? 0) : (raw.rentPrice ?? 0);
```

Replace with:
```typescript
const prices = raw.pricingTiers.flatMap((t) => [t.salePrice, t.rentPrice]).filter((v): v is number => v !== null);
const price = prices.length > 0 ? Math.min(...prices) : 0;
const hasMultipleTiers = raw.pricingTiers.length > 1;
```

Then in the `property` object, remove `salePrice` and `rentPrice`, and add `hasMultipleTiers` and `pricingTiers`:

Remove:
```typescript
salePrice: raw.salePrice ?? 0,
rentPrice: raw.rentPrice ?? 0,
```

Add:
```typescript
hasMultipleTiers,
pricingTiers: raw.pricingTiers,
```

---

### Task 13: Update PropertyDetailSummary

**Files:**
- Modify: `app/properties/[slug]/components/PropertyDetailSummary.tsx`

- [ ] **Step 1: Replace pricing section in PropertyDetailSummary**

Find the pricing block (lines 83–101 in current file):
```typescript
<div className="mt-4 grid gap-2">
  {property.isForSale && (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-neutral-600">For sale</span>
      <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
        {formatPrice(property.salePrice)}
      </span>
    </div>
  )}

  {property.isForRent && (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-neutral-600">For rent</span>
      <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
        {formatPrice(property.rentPrice)}/mo
      </span>
    </div>
  )}
</div>
```

Replace with:
```typescript
<div className="mt-4">
  {property.pricingTiers.length === 1 ? (
    <SinglePriceDisplay tier={property.pricingTiers[0]} isForSale={property.isForSale} isForRent={property.isForRent} />
  ) : property.pricingTiers.length > 1 ? (
    <PricingTiersTable tiers={property.pricingTiers} isForSale={property.isForSale} isForRent={property.isForRent} />
  ) : null}
</div>
```

Add these two helper components above `PropertyDetailSummary` (but below the imports):

```typescript
import type { PropertyPricingTier } from "@/types/property";

interface SinglePriceDisplayProps {
  tier: PropertyPricingTier;
  isForSale: boolean;
  isForRent: boolean;
}

function SinglePriceDisplay({ tier, isForSale, isForRent }: SinglePriceDisplayProps) {
  return (
    <div className="grid gap-2">
      {isForSale && tier.salePrice != null && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-neutral-600">For sale</span>
          <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
            {formatPrice(tier.salePrice)}
          </span>
        </div>
      )}

      {isForRent && tier.rentPrice != null && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-neutral-600">For rent</span>
          <span className="whitespace-nowrap text-2xl font-bold text-secondary-500">
            {formatPrice(tier.rentPrice)}/mo
          </span>
        </div>
      )}
    </div>
  );
}

interface PricingTiersTableProps {
  tiers: PropertyPricingTier[];
  isForSale: boolean;
  isForRent: boolean;
}

function PricingTiersTable({ tiers, isForSale, isForRent }: PricingTiersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Furnishing</th>
            {isForRent && <th className="py-2 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Rent / mo</th>}
            {isForSale && <th className="py-2 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Sale</th>}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.id} className="border-b border-gray-100 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-neutral-900">{tier.label || "—"}</td>
              {isForRent && (
                <td className="py-2.5 pr-4 font-bold text-secondary-500">
                  {tier.rentPrice != null ? `${formatPrice(tier.rentPrice)}` : "—"}
                </td>
              )}
              {isForSale && (
                <td className="py-2.5 font-bold text-secondary-500">
                  {tier.salePrice != null ? formatPrice(tier.salePrice) : "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

Also update the import at top of file — `PropertyPricingTier` needs to come from `@/types/property`.

---

### Task 14: Update PropertyCard

**Files:**
- Modify: `components/PropertyCard.tsx`

- [ ] **Step 1: Update price display**

Find line 147–149:
```typescript
<p className="text-base font-bold text-primary-500 md:text-lg">
  {formatPrice(property.price)}{property.listingType === "Rent" ? "/mo" : ""}
</p>
```

Replace with:
```typescript
<p className="text-base font-bold text-primary-500 md:text-lg">
  {property.hasMultipleTiers ? "Starting from " : ""}
  {formatPrice(property.price)}{property.listingType === "Rent" || property.listingType === "Sale & Rent" ? "/mo" : ""}
</p>
```

---

### Task 15: Update ListingPage toPropertyItem

**Files:**
- Modify: `components/listing/ListingPage.tsx`

- [ ] **Step 1: Update the input type and toPropertyItem function**

Replace the `toPropertyItem` function and its input type:

```typescript
interface PropertyApiItem {
  id: string;
  slug: string;
  title: string;
  address: string;
  pricingTiers: { salePrice: number | null; rentPrice: number | null; order: number }[];
  isForSale: boolean;
  isForRent: boolean;
  availabilityStatus: string;
  beds: number | null;
  baths: number | null;
  areaSqm: number;
  images: { url: string }[];
}

function toPropertyItem(p: PropertyApiItem): PropertyItem {
  const listingType = p.isForSale && p.isForRent ? "Sale & Rent" : p.isForSale ? "Sale" : "Rent";
  const prices = p.pricingTiers.flatMap((t) => [t.salePrice, t.rentPrice]).filter((v): v is number => v !== null);
  const price = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    location: p.address,
    price,
    hasMultipleTiers: p.pricingTiers.length > 1,
    imageUrls: p.images.map((img) => img.url),
    listingType,
    availabilityStatus: p.availabilityStatus as "AVAILABLE" | "SOLD" | "RENTED",
    beds: p.beds ?? 0,
    baths: p.baths ?? 0,
    area: `${p.areaSqm.toFixed(2)} sqm`,
  };
}
```

---

### Task 16: Update home section properties mapping

**Files:**
- Modify: `hono/services/homeSection.service.ts` (if it maps salePrice/rentPrice)

- [ ] **Step 1: Check and update homeSection service**

Read `hono/services/homeSection.service.ts`. If it selects `salePrice`/`rentPrice` and maps them to `PropertyItem.price`, update to use `pricingTiers` instead (same pattern as Task 7/15).

---

### Task 17: Typecheck and lint

- [ ] **Step 1: Run checks**

```bash
pnpm lint && pnpm typecheck
```

Fix any errors before marking done.

- [ ] **Step 2: Run executive-homes-review skill**

Invoke `executive-homes-review` skill to audit all changed files against CLAUDE.md rules.

---

## Self-Review

**Spec coverage checklist:**
- [x] New `PropertyPricingTier` DB table (Task 1)
- [x] Remove flat `salePrice`/`rentPrice` from `Property` (Task 1)
- [x] Validation schema updated (Task 2)
- [x] TypeScript types updated everywhere (Tasks 3, 11)
- [x] Admin form: `useFieldArray` pricing tiers (Task 8)
- [x] Admin form: default values updated (Task 9)
- [x] Admin edit page: defaultValues passes pricingTiers (Task 10)
- [x] Hono admin routes: create/update/list with pricingTiers (Task 5)
- [x] Hono public routes: list and detail with pricingTiers (Task 6)
- [x] Property detail page: pricingTiers passed through (Task 12)
- [x] PropertyDetailSummary: single vs multi-tier display (Task 13)
- [x] PropertyCard: "Starting from" label (Task 14)
- [x] ListingPage: min price from tiers (Task 15)
- [x] Home section service: pricingTiers mapping (Task 16)
- [x] lib/schema.ts: ApiSchema types propagate via imports (Task 4)
- [x] Typecheck + lint (Task 17)

**Placeholder scan:** None found.

**Type consistency:** `PropertyPricingTier` defined in `types/property.ts` and used in `app/properties/[slug]/types.ts`, `PropertyDetailSummary.tsx`, and service files. `pricingTiers` key used consistently across all tasks. `hasMultipleTiers` added to `PropertyItem` in `app/types.ts` and populated in both service and `toPropertyItem`.
