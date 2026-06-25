# Home Search Input Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typing-effect placeholder and floating dropdown to the home hero search input so users can open province or BTS/MRT station pickers and filter properties by location.

**Architecture:** New `HomeSearchInput` component replaces the plain `Input` in `HomeHero`. Backend gains a public transit stations route and a `stationIds` filter on the properties route. `ListingPage` reads two new URL params (`provinceId`, `stationIds`) and passes them to the API. `TransitStationPickerModal` gains an optional `onConfirmWithStations` callback that returns `{id, name}[]` so the caller can display names without a second fetch.

**Tech Stack:** React 19, Next.js 16, Hono, Prisma, Zod, `nuqs`, `lucide-react`, `ReactDOM.createPortal`

## Global Constraints

- Never use `any` type in TypeScript
- No comments unless the WHY is non-obvious
- Use `classNames` util from `@/utils/classNames` for multiple className strings
- Use `pnpm` as package manager
- Run `pnpm lint && pnpm typecheck` before every commit
- Never use `useMemo` or `useCallback`
- Never use `useEffect` to set form initial values (timer/animation use is fine)
- Icons from `lucide-react` only
- Use `nuqs` for query string parsing in `ListingPage`
- Protected admin API routes must use `authMiddleware` + `adminMiddleware`
- Wrap direct Prisma calls in `try/catch` with safe fallback

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `hono/routes/publicTransitStations.routes.ts` | Create | Public GET /transit-stations endpoint |
| `hono/routes/index.ts` | Modify | Export new route |
| `hono/index.ts` | Modify | Register `/transit-stations` route |
| `validation/publicPropertySchema.ts` | Modify | Add `stationIds` field |
| `hono/routes/publicProperties.routes.ts` | Modify | Apply `stationIds` filter |
| `lib/schema.ts` | Modify | Add `stationIds` to properties query; add transit-stations public endpoint type |
| `components/@shared/TransitStationPickerModal.tsx` | Modify | Add `onConfirmWithStations`, add optional `endpoint` prop |
| `components/listing/ListingPage.tsx` | Modify | Read `provinceId` + `stationIds` URL params, pass to API |
| `app/components/home/HomeSearchInput.tsx` | Create | Typing effect + portal dropdown + province/transit pickers |
| `app/components/home/HomeHero.tsx` | Modify | Replace `Input` block with `HomeSearchInput` |
| `app/components/home/index.ts` | Modify | Export `HomeSearchInput` |

---

## Task 1: Public Transit Stations Route

**Files:**
- Create: `hono/routes/publicTransitStations.routes.ts`
- Modify: `hono/routes/index.ts`
- Modify: `hono/index.ts`

**Interfaces:**
- Produces: `GET /api/transit-stations` → `{ stations: TransitStation[] }` (no auth required)

- [ ] **Step 1: Create the route file**

```ts
// hono/routes/publicTransitStations.routes.ts
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const publicTransitStationsRoutes = new Hono();

publicTransitStationsRoutes.get("/", async (c) => {
  try {
    const stations = await prisma.transitStation.findMany({
      orderBy: [{ line: "asc" }, { name: "asc" }],
    });
    return c.json({ stations });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default publicTransitStationsRoutes;
```

- [ ] **Step 2: Export from routes index**

In `hono/routes/index.ts`, add at the end of existing exports:
```ts
export { default as publicTransitStationsRoutes } from "./publicTransitStations.routes";
```

- [ ] **Step 3: Register in hono app**

In `hono/index.ts`, add the import to the existing destructured import block:
```ts
import {
  // ...existing imports...
  publicTransitStationsRoutes,
} from "@/hono/routes";
```

Then add the route registration after the `/locations` line:
```ts
router.route("/transit-stations", publicTransitStationsRoutes);
```

- [ ] **Step 4: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add hono/routes/publicTransitStations.routes.ts hono/routes/index.ts hono/index.ts
git commit -m "feat(api): add public transit stations route"
```

---

## Task 2: Add stationIds Filter to Properties Route

**Files:**
- Modify: `validation/publicPropertySchema.ts`
- Modify: `hono/routes/publicProperties.routes.ts`

**Interfaces:**
- Consumes: existing `publicPropertyListQuerySchema`
- Produces: `stationIds` query param (comma-separated station IDs string) filters properties by transit station

- [ ] **Step 1: Add stationIds to validation schema**

In `validation/publicPropertySchema.ts`, add `stationIds` to the schema object:
```ts
import { z } from "zod";

export const publicPropertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  isForSale: z.coerce.boolean().optional(),
  isForRent: z.coerce.boolean().optional(),
  type: z.string().optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  beds: z.coerce.number().int().optional(),
  q: z.string().optional(),
  stationIds: z.string().optional(),
});
```

- [ ] **Step 2: Apply filter in route**

In `hono/routes/publicProperties.routes.ts`, update the destructure and add the filter:

```ts
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { zv } from "@/validation/zv";
import { publicPropertyListQuerySchema } from "@/validation/publicPropertySchema";

const publicPropertiesRoutes = new Hono();

publicPropertiesRoutes.get("/", zv("query", publicPropertyListQuerySchema), async (c) => {
  const { page, limit, isForSale, isForRent, type, provinceId, districtId, beds, q, stationIds } = c.req.valid("query");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (isForSale !== undefined) where.isForSale = isForSale;
  if (isForRent !== undefined) where.isForRent = isForRent;
  if (type) where.propertyType = { slug: type };
  if (provinceId) where.provinceId = provinceId;
  if (districtId) where.districtId = districtId;
  if (beds !== undefined) where.beds = beds;
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (stationIds) {
    const ids = stationIds.split(",").filter(Boolean);
    where.transitStations = { some: { stationId: { in: ids } } };
  }

  const orderBy = { createdAt: "desc" as const };

  try {
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
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// keep existing /:slug route unchanged below this point
```

- [ ] **Step 3: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add validation/publicPropertySchema.ts hono/routes/publicProperties.routes.ts
git commit -m "feat(api): add stationIds filter to public properties route"
```

---

## Task 3: Update lib/schema.ts for New Routes

**Files:**
- Modify: `lib/schema.ts`

**Interfaces:**
- Produces: `api("transit-stations").GET()` type for Spoosh; `stationIds` in properties GET query type

- [ ] **Step 1: Add transit-stations type and stationIds to properties query**

In `lib/schema.ts`, find the `"properties"` GET entry and add `stationIds?: string` to the query type. Also add a new `"transit-stations"` entry. The exact lines depend on your schema file structure — find the `"properties"` block:

```ts
// Add stationIds to the existing properties GET query type:
"properties": {
  GET: {
    data: { properties: PublicPropertyListItem[]; total: number; page: number; limit: number };
    query?: { page?: string; limit?: string; isForSale?: string; isForRent?: string; type?: string; provinceId?: string; beds?: string; q?: string; sort?: string; stationIds?: string };
  };
};
```

Add the new transit-stations public entry (place it near other public routes):
```ts
"transit-stations": {
  GET: { data: { stations: TransitStation[] } };
};
```

Where `TransitStation` is already imported/defined in the types. Check existing type imports at the top of `lib/schema.ts` and import `TransitStation` from `@/types/transitStation` if not already present:
```ts
import type { TransitStation } from "@/types/transitStation";
```

- [ ] **Step 2: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/schema.ts
git commit -m "feat(schema): add transit-stations route type and stationIds to properties query"
```

---

## Task 4: Enhance TransitStationPickerModal

**Files:**
- Modify: `components/@shared/TransitStationPickerModal.tsx`

**Interfaces:**
- Consumes: existing `openTransitStationPicker` usage in `PropertyFormTransitSection.tsx` — must remain unchanged
- Produces:
  ```ts
  openTransitStationPicker(opts: {
    selectedIds: string[];
    onConfirm: (ids: string[]) => void;
    onConfirmWithStations?: (stations: { id: string; name: string }[]) => void;
    multiple?: boolean;
    endpoint?: "admin/transit-stations" | "transit-stations";
  })
  ```

- [ ] **Step 1: Update TransitStationPickerModalProps and openTransitStationPicker**

Replace the top of `components/@shared/TransitStationPickerModal.tsx` (interfaces + open function):

```ts
"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Search, Train, X } from "lucide-react";
import { Button, Dialog, Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import {
  TRANSIT_LINES,
  TRANSIT_LINE_COLORS,
  TRANSIT_LINE_LABELS,
  type TransitLine,
} from "@/constants/transitStations";
import { classNames } from "@/utils/classNames";
import type { TransitStation } from "@/types/transitStation";

interface TransitStationPickerModalProps {
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
  onConfirmWithStations?: (stations: { id: string; name: string }[]) => void;
  dismiss: () => void;
  multiple?: boolean;
  endpoint?: "admin/transit-stations" | "transit-stations";
}

export function openTransitStationPicker(opts: {
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
  onConfirmWithStations?: (stations: { id: string; name: string }[]) => void;
  multiple?: boolean;
  endpoint?: "admin/transit-stations" | "transit-stations";
}) {
  Dialog.show({
    className: "w-full max-w-2xl",
    content: ({ dismiss }) => (
      <TransitStationPickerModal
        selectedIds={opts.selectedIds}
        onConfirm={(ids) => {
          opts.onConfirm(ids);
          dismiss();
        }}
        onConfirmWithStations={opts.onConfirmWithStations ? (stations) => {
          opts.onConfirmWithStations!(stations);
          dismiss();
        } : undefined}
        dismiss={dismiss}
        multiple={opts.multiple}
        endpoint={opts.endpoint}
      />
    ),
  });
}
```

- [ ] **Step 2: Update TransitStationPickerModal component signature and data fetch**

Replace the `export default function TransitStationPickerModal` signature and the `useRead` call:

```ts
export default function TransitStationPickerModal({
  selectedIds,
  onConfirm,
  onConfirmWithStations,
  dismiss,
  multiple = true,
  endpoint = "admin/transit-stations",
}: TransitStationPickerModalProps) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, loading } = useRead((api) => api(endpoint as "admin/transit-stations").GET());
  const stations = data?.stations ?? [];
```

Note: casting `endpoint` as `"admin/transit-stations"` satisfies the Spoosh type while still accepting either value at runtime — both routes return the same `{ stations: TransitStation[] }` shape.

- [ ] **Step 3: Update the Confirm button handler**

Find the Confirm `<Button>` near the bottom of the component and update its `onClick`:

```tsx
<Button
  type="button"
  onClick={() => {
    const ids = Array.from(localSelected);

    if (onConfirmWithStations) {
      const selected = stations.filter((s) => localSelected.has(s.id)).map((s) => ({ id: s.id, name: s.name }));
      onConfirmWithStations(selected);
    } else {
      onConfirm(ids);
    }
  }}
>
  Confirm
</Button>
```

- [ ] **Step 4: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors. Existing `PropertyFormTransitSection.tsx` still compiles since `onConfirmWithStations` and `endpoint` are optional.

- [ ] **Step 5: Commit**

```bash
git add components/@shared/TransitStationPickerModal.tsx
git commit -m "feat(transit-picker): add onConfirmWithStations callback and endpoint prop"
```

---

## Task 5: Update ListingPage to Support provinceId + stationIds

**Files:**
- Modify: `components/listing/ListingPage.tsx`

**Interfaces:**
- Consumes: URL query params `provinceId` (string) and `stationIds` (comma-separated string)
- Produces: passes both to `api("properties").GET({ query })` — matches schema added in Task 3

- [ ] **Step 1: Add provinceId and stationIds query state**

In `components/listing/ListingPage.tsx`, add two new `useQueryState` calls after the existing ones:

```ts
const [q] = useQueryState("q", parseAsString.withDefault(""));
const [tab] = useQueryState("tab", parseAsString.withDefault(defaultTab));
const [bedrooms] = useQueryState("bedrooms");
const [page] = useQueryState("page", parseAsInteger.withDefault(1));
const [provinceId] = useQueryState("provinceId");
const [stationIds] = useQueryState("stationIds");
```

- [ ] **Step 2: Pass to API query**

Update the `query` object to include the new params:

```ts
const query = {
  page: String(page),
  limit: "12",
  ...(isForRent ? { isForRent } : {}),
  ...(isForSale ? { isForSale } : {}),
  ...(q ? { q } : {}),
  ...(bedrooms ? { beds: bedrooms } : {}),
  ...(propertyType ? { type: propertyType } : {}),
  ...(provinceId ? { provinceId } : {}),
  ...(stationIds ? { stationIds } : {}),
};
```

- [ ] **Step 3: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/listing/ListingPage.tsx
git commit -m "feat(listing): read provinceId and stationIds from URL params"
```

---

## Task 6: Create HomeSearchInput Component

**Files:**
- Create: `app/components/home/HomeSearchInput.tsx`

**Interfaces:**
- Consumes:
  - `openLocationPicker` from `@/components/@shared/LocationPickerDialog` → `onApply: (sel: LocationSelection) => void`
  - `openTransitStationPicker` from `@/components/@shared/TransitStationPickerModal` → `onConfirmWithStations: (stations: {id, name}[]) => void`, `endpoint: "transit-stations"`
- Produces:
  ```ts
  interface HomeSearchInputProps {
    tab: "rent" | "buy";
    onSearch: (params: { q?: string; provinceId?: string; stationIds?: string }) => void;
  }
  ```

- [ ] **Step 1: Create the component file**

```tsx
// app/components/home/HomeSearchInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin, Train } from "lucide-react";
import { Button, Input } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openLocationPicker } from "@/components/@shared/LocationPickerDialog";
import { openTransitStationPicker } from "@/components/@shared/TransitStationPickerModal";

const SEARCH_PLACEHOLDER_PHRASES = [
  "Provinces",
  "BTS / MRT Stations",
  "Bangkok",
  "Condo, Townhouse...",
];

interface HomeSearchInputProps {
  tab: "rent" | "buy";
  onSearch: (params: { q?: string; provinceId?: string; stationIds?: string }) => void;
}

export function HomeSearchInput({ tab, onSearch }: HomeSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [stationIds, setStationIds] = useState<string[]>([]);

  const anchorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue !== "" || isFocused) {
      setAnimatedPlaceholder("");
      return;
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let pausing = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = SEARCH_PLACEHOLDER_PHRASES[phraseIdx];

      if (pausing) {
        pausing = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % SEARCH_PLACEHOLDER_PHRASES.length;
        setAnimatedPlaceholder("");
        timer = setTimeout(tick, 300);
        return;
      }

      if (charIdx < phrase.length) {
        setAnimatedPlaceholder(phrase.slice(0, charIdx + 1));
        charIdx++;
        timer = setTimeout(tick, 80);
      } else {
        pausing = true;
        timer = setTimeout(tick, 2000);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [inputValue, isFocused]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        anchorRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setDropdownOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const openDropdownAtAnchor = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setProvinceId(null);
    setStationIds([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
    openDropdownAtAnchor();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleProvinceClick = () => {
    setDropdownOpen(false);
    openLocationPicker({
      onApply: (sel) => {
        if (!sel.provinceName) return;
        const display = sel.districtName
          ? `${sel.provinceName} › ${sel.districtName}`
          : sel.provinceName;
        setInputValue(display);
        setProvinceId(sel.provinceId);
        setStationIds([]);
      },
    });
  };

  const handleTransitClick = () => {
    setDropdownOpen(false);
    openTransitStationPicker({
      selectedIds: stationIds,
      onConfirm: () => {},
      onConfirmWithStations: (stations) => {
        setInputValue(stations.map((s) => s.name).join(", "));
        setStationIds(stations.map((s) => s.id));
        setProvinceId(null);
      },
      multiple: true,
      endpoint: "transit-stations",
    });
  };

  const handleSearch = () => {
    if (provinceId) {
      onSearch({ provinceId });
    } else if (stationIds.length > 0) {
      onSearch({ stationIds: stationIds.join(",") });
    } else {
      onSearch({ q: inputValue.trim() || undefined });
    }
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-2">
      <div ref={anchorRef} className="flex-1">
        <Input
          aria-label="Search keyword"
          placeholder={animatedPlaceholder || "Search..."}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border-border [&:focus-within]:border-primary-500"
          inputClassName="h-12 text-base font-medium text-neutral-900 md:h-[46px] md:text-sm"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleSearch}
        className="h-12 rounded-md bg-gradient-to-b from-primary-500 to-primary-400 px-[30px] text-base font-semibold !text-white hover:bg-gradient-to-b md:h-[46px] md:text-sm"
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </Button>

      {dropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
            }}
            className="rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleProvinceClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
              Search by Province
            </button>
            <div className="mx-4 border-t border-gray-100" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleTransitClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Train className="h-4 w-4 text-primary-500 shrink-0" />
              Search by BTS/MRT
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
```

Note: `onMouseDown={(e) => e.preventDefault()` on dropdown buttons prevents the input `onBlur` from firing before `onClick` runs — without this the dropdown closes before the click registers.

- [ ] **Step 2: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/home/HomeSearchInput.tsx
git commit -m "feat(home): add HomeSearchInput with typing effect and floating location picker dropdown"
```

---

## Task 7: Wire HomeSearchInput into HomeHero

**Files:**
- Modify: `app/components/home/HomeHero.tsx`
- Modify: `app/components/home/index.ts`

**Interfaces:**
- Consumes: `HomeSearchInput` from `./HomeSearchInput` with `{ tab, onSearch }` props
- Produces: `onSearch` builds URL params from `{q?, provinceId?, stationIds?}` and calls `router.push`

- [ ] **Step 1: Update HomeHero**

Replace the contents of `app/components/home/HomeHero.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Select, SelectOption } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { HOME_HERO_FILTER_OPTIONS } from "@/app/constants";
import { HomePetToggle } from "./HomePetToggle";
import { HomeSearchInput } from "./HomeSearchInput";

export function HomeHero() {
  const router = useRouter();
  const [tab, setTab] = useState<"rent" | "buy">("rent");
  const [type, setType] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [petAllow, setPetAllow] = useState(false);

  const selectClass = classNames(
    "h-[46px] rounded-md border border-border bg-white px-[18px]",
    "text-sm font-semibold text-neutral-600 shadow-none",
  );

  const handleSearch = (params: { q?: string; provinceId?: string; stationIds?: string }) => {
    const urlParams = new URLSearchParams();
    urlParams.set("tab", tab === "rent" ? "rent" : "buy");
    if (params.q) urlParams.set("q", params.q);
    if (params.provinceId) urlParams.set("provinceId", params.provinceId);
    if (params.stationIds) urlParams.set("stationIds", params.stationIds);
    if (bedrooms) urlParams.set("bedrooms", bedrooms);
    router.push(`/properties?${urlParams.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-[url('/banner.webp')] bg-cover bg-center text-white md:h-[698px] md:overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/90 via-secondary-950/70 to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-3 px-5 pt-16 text-center md:absolute md:left-0 md:right-0 md:top-[190px] md:gap-2.5 md:px-6 md:pt-0">
        <Image
          src="/logo-full.svg"
          alt="Executive Homes"
          width={180}
          height={92}
          className="mb-2 h-24 w-[188px] animate-fade-up [animation-delay:0ms] md:h-[120px] md:w-[235px]"
        />
        <h1 className="max-w-[340px] animate-fade-up text-[32px] font-black leading-[1.12] tracking-tight [animation-delay:100ms] md:max-w-[699px] md:text-[40px] md:leading-[1.5]">
          Your Gateway to Elite Living
        </h1>
        <p className="max-w-[340px] animate-fade-up text-sm font-normal leading-6 text-white/90 [animation-delay:300ms] md:max-w-none md:text-lg md:leading-[1.5]">
          Find the right place, at the best price,{" "}
          <span className="whitespace-nowrap">hassle-free</span>
        </p>
      </div>

      <div className="relative z-50 mt-8 w-full max-w-[954px] px-4 pb-8 md:absolute md:bottom-10 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:translate-y-1/2 md:px-6 md:pb-0 lg:px-0">
        <div className="mx-auto mb-4 grid w-full max-w-[280px] grid-cols-2 items-center rounded-lg border border-white/40 bg-black/60 p-1 md:flex md:w-fit md:max-w-none">
          {(["rent", "buy"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={classNames(
                "rounded-md px-4 py-2.5 text-base font-semibold capitalize text-white transition-all md:px-[38px] md:py-2",
                tab === t ? "bg-gradient-to-b from-primary-500 to-primary-400" : "",
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgb(17_24_39/0.16)] md:rounded-xl md:p-[22px] md:shadow-[0_4px_12px_rgb(17_24_39/0.08)]">
          <HomeSearchInput tab={tab} onSearch={handleSearch} />

          <div className="mt-3 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
            <Select
              value={type}
              onChange={setType}
              placeholder="Type"
              className={selectClass}
              wrapperClassName="min-w-0 md:flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.types.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={location}
              onChange={setLocation}
              placeholder="Location"
              className={selectClass}
              wrapperClassName="min-w-0 md:flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.locations.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={price}
              onChange={setPrice}
              placeholder="Price"
              className={selectClass}
              wrapperClassName="min-w-0 md:flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.prices.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <Select
              value={bedrooms}
              onChange={setBedrooms}
              placeholder="Bedrooms"
              className={selectClass}
              wrapperClassName="min-w-0 md:flex-1"
            >
              {HOME_HERO_FILTER_OPTIONS.bedrooms.map((o) => (
                <SelectOption key={o.value} value={o.value} label={o.label} />
              ))}
            </Select>

            <div className="col-span-2 flex justify-end self-center md:col-span-1">
              <HomePetToggle value={petAllow} onChange={setPetAllow} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

In `app/components/home/index.ts`, add:
```ts
export { HomeSearchInput } from "./HomeSearchInput";
```

- [ ] **Step 3: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: no errors.

- [ ] **Step 4: Run the executive-homes-review skill**

Run `executive-homes-review` skill to audit all changed files against CLAUDE.md rules before committing.

- [ ] **Step 5: Commit**

```bash
git add app/components/home/HomeHero.tsx app/components/home/HomeSearchInput.tsx app/components/home/index.ts
git commit -m "feat(home): wire HomeSearchInput into HomeHero with province and transit navigation"
```
