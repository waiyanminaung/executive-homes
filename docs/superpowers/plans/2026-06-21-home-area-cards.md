# Home Area Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `HOME_AREA_CARDS` mock with a DB-driven `HomeAreaCard` entity, giving admins full CRUD control of the home page Locations section with dynamic listing counts.

**Architecture:** New `HomeAreaCard` Prisma model links each area card to a Province or District for dynamic property counting. An admin Hono route handles CRUD (auth-guarded), a server-side `getHomeAreaCards()` function fetches + enriches data for the home page Server Component. The admin `pages/home` page gains a second "Locations" section below the existing HomeSections list, following the same Row/Form expand pattern.

**Tech Stack:** Prisma, Hono, Zod, React Hook Form, Spoosh (`useRead`/`useWrite`/`form()`), GeckoUI (`RHFInput`, `RHFSelect`, `RHFNumberInput`, `RHFError`, `ConfirmDialog`), `@dnd-kit` (drag-to-reorder, same as HomeSections), Next.js Server Components, R2 via `POST /api/admin/media`.

## Global Constraints

- Never use `any` type in TypeScript
- No comments unless the why is non-obvious
- `pnpm` as package manager
- `classNames` util from `@/utils/classNames` for multiple classNames
- `FormProvider` wraps all RHF forms
- No `useMemo`/`useCallback`
- Use optional chaining, not `obj.nested && 'prop' in obj.nested`
- Zod schemas in `validation/` (shared frontend/backend)
- All API types in `lib/schema.ts`
- Protected admin routes use `authMiddleware` + `adminMiddleware`
- `lucide-react` for icons only
- After implementation: run `pnpm lint && pnpm typecheck`
- Never run `prisma migrate` or `prisma db push` — ask user to run them
- Component files max ~200 lines; extract if over

---

### Task 1: Prisma Model

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `HomeAreaCard` Prisma model with `id`, `name`, `imageKey`, `order`, `provinceId`, `province`, `districtId`, `district`, `createdAt`, `updatedAt`

- [ ] **Step 1: Add `HomeAreaCard` model to schema**

Open `prisma/schema.prisma`. After the `HomeSection` model block, add:

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

Also add back-relations to `Province` and `District` models. In the `Province` model block add:
```prisma
  homeAreaCards HomeAreaCard[]
```
In the `District` model block add:
```prisma
  homeAreaCards HomeAreaCard[]
```

- [ ] **Step 2: Ask user to run migration**

Tell the user:
> Please run: `pnpm prisma migrate dev --name add-home-area-cards`
> Wait for confirmation before continuing.

---

### Task 2: Validation Schema + Types

**Files:**
- Create: `validation/homeAreaCardSchema.ts`
- Create: `types/homeAreaCard.ts`

**Interfaces:**
- Produces:
  - `homeAreaCardCreateSchema`, `HomeAreaCardCreateInput`
  - `homeAreaCardUpdateSchema`, `HomeAreaCardUpdateInput`
  - `homeAreaCardFormSchema`, `HomeAreaCardFormValues` (RHF-only, no imageKey)
  - `HomeAreaCard` interface (admin API response shape)
  - `ClientHomeAreaCard` interface (public API response, adds `listings` + `imageUrl`)

- [ ] **Step 1: Create validation schema**

Create `validation/homeAreaCardSchema.ts`:

```typescript
import { z } from "zod";

export const homeAreaCardCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageKey: z.string().min(1, "Image is required"),
  order: z.number().int().min(0),
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
});

export type HomeAreaCardCreateInput = z.infer<typeof homeAreaCardCreateSchema>;

export const homeAreaCardUpdateSchema = homeAreaCardCreateSchema.partial();
export type HomeAreaCardUpdateInput = z.infer<typeof homeAreaCardUpdateSchema>;

export const homeAreaCardFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  order: z.number().int().min(0),
  provinceId: z.string().nullable().optional(),
  districtId: z.string().nullable().optional(),
});

export type HomeAreaCardFormValues = z.infer<typeof homeAreaCardFormSchema>;
```

- [ ] **Step 2: Create types**

Create `types/homeAreaCard.ts`:

```typescript
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

export interface ClientHomeAreaCard extends HomeAreaCard {
  listings: number;
  imageUrl: string;
}
```

- [ ] **Step 3: Commit**

```bash
git add validation/homeAreaCardSchema.ts types/homeAreaCard.ts
git commit -m "feat(home-area-cards): add validation schema and types"
```

---

### Task 3: Hono Routes + API Schema Wiring

**Files:**
- Create: `hono/routes/homeAreaCards.routes.ts`
- Create: `hono/routes/publicHomeAreaCards.routes.ts`
- Modify: `hono/routes/index.ts`
- Modify: `hono/index.ts`
- Modify: `lib/schema.ts`

**Interfaces:**
- Consumes: `homeAreaCardCreateSchema`, `homeAreaCardUpdateSchema` from `validation/homeAreaCardSchema`
- Consumes: `HomeAreaCard`, `ClientHomeAreaCard` from `types/homeAreaCard`
- Produces:
  - Admin routes on `/api/admin/home-area-cards`
  - Public route on `/api/home-area-cards`
  - `lib/schema.ts` entries for both

- [ ] **Step 1: Create admin route**

Create `hono/routes/homeAreaCards.routes.ts`:

```typescript
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { homeAreaCardCreateSchema, homeAreaCardUpdateSchema } from "@/validation/homeAreaCardSchema";
import type { AppEnv } from "@/hono/types";

const homeAreaCardsRoutes = new Hono<AppEnv>();

homeAreaCardsRoutes.use("*", authMiddleware, adminMiddleware);

const INCLUDE = {
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
} as const;

homeAreaCardsRoutes.get("/", async (c) => {
  const areaCards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: INCLUDE,
  });
  return c.json({ areaCards });
});

homeAreaCardsRoutes.post("/", zv("json", homeAreaCardCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const areaCard = await prisma.homeAreaCard.create({ data, include: INCLUDE });
  return c.json({ areaCard }, 201);
});

homeAreaCardsRoutes.patch("/:id", zv("json", homeAreaCardUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const existing = await prisma.homeAreaCard.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Area card not found" }, 404);

  const areaCard = await prisma.homeAreaCard.update({ where: { id }, data, include: INCLUDE });
  return c.json({ areaCard });
});

homeAreaCardsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.homeAreaCard.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "Area card not found" }, 404);

  await prisma.homeAreaCard.delete({ where: { id } });
  return c.json({ ok: true });
});

export default homeAreaCardsRoutes;
```

- [ ] **Step 2: Create public route**

Create `hono/routes/publicHomeAreaCards.routes.ts`:

```typescript
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/utils/getMediaUrl";

const publicHomeAreaCardsRoutes = new Hono();

const INCLUDE = {
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
} as const;

publicHomeAreaCardsRoutes.get("/", async (c) => {
  const cards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: INCLUDE,
  });

  const areaCards = await Promise.all(
    cards.map(async (card) => {
      let listings = 0;

      if (card.districtId) {
        listings = await prisma.property.count({
          where: { isPublished: true, districtId: card.districtId },
        });
      } else if (card.provinceId) {
        listings = await prisma.property.count({
          where: { isPublished: true, provinceId: card.provinceId },
        });
      }

      return { ...card, listings, imageUrl: getMediaUrl(card.imageKey) };
    }),
  );

  return c.json({ areaCards });
});

export default publicHomeAreaCardsRoutes;
```

- [ ] **Step 3: Export from routes barrel**

In `hono/routes/index.ts`, add at the end:

```typescript
export { default as homeAreaCardsRoutes } from "./homeAreaCards.routes";
export { default as publicHomeAreaCardsRoutes } from "./publicHomeAreaCards.routes";
```

- [ ] **Step 4: Register routes in hono/index.ts**

In `hono/index.ts`, add to the imports:
```typescript
import {
  // ...existing imports...
  homeAreaCardsRoutes,
  publicHomeAreaCardsRoutes,
} from "@/hono/routes";
```

Add route registrations after the existing home-sections registrations:
```typescript
router.route("/admin/home-area-cards", homeAreaCardsRoutes);
router.route("/home-area-cards", publicHomeAreaCardsRoutes);
```

- [ ] **Step 5: Add API types to lib/schema.ts**

In `lib/schema.ts`, add these imports at the top (after existing imports):
```typescript
import type { HomeAreaCard, ClientHomeAreaCard } from "@/types/homeAreaCard";
import type { HomeAreaCardCreateInput, HomeAreaCardUpdateInput } from "@/validation/homeAreaCardSchema";
```

Add these entries to the `ApiSchema` type (after the `"home-sections"` entry):
```typescript
  "admin/home-area-cards": {
    GET: { data: { areaCards: HomeAreaCard[] } };
    POST: { data: { areaCard: HomeAreaCard }; body: HomeAreaCardCreateInput };
  };
  "admin/home-area-cards/:id": {
    PATCH: { data: { areaCard: HomeAreaCard }; params: { id: string }; body: HomeAreaCardUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "home-area-cards": {
    GET: { data: { areaCards: ClientHomeAreaCard[] } };
  };
```

- [ ] **Step 6: Commit**

```bash
git add hono/routes/homeAreaCards.routes.ts hono/routes/publicHomeAreaCards.routes.ts hono/routes/index.ts hono/index.ts lib/schema.ts
git commit -m "feat(home-area-cards): add hono routes and API schema"
```

---

### Task 4: Server-Side Data Fetcher

**Files:**
- Create: `lib/getHomeAreaCards.ts`

**Interfaces:**
- Consumes: `prisma.homeAreaCard`, `prisma.property.count`, `getMediaUrl` from `@/utils/getMediaUrl`
- Produces: `getHomeAreaCards(): Promise<ClientHomeAreaCard[]>` — used by the home page Server Component

- [ ] **Step 1: Create fetcher**

Create `lib/getHomeAreaCards.ts`:

```typescript
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/utils/getMediaUrl";
import type { ClientHomeAreaCard } from "@/types/homeAreaCard";

export async function getHomeAreaCards(): Promise<ClientHomeAreaCard[]> {
  const cards = await prisma.homeAreaCard.findMany({
    orderBy: { order: "asc" },
    include: {
      province: { select: { id: true, name: true, slug: true } },
      district: { select: { id: true, name: true, slug: true } },
    },
  });

  return Promise.all(
    cards.map(async (card) => {
      let listings = 0;

      if (card.districtId) {
        listings = await prisma.property.count({
          where: { isPublished: true, districtId: card.districtId },
        });
      } else if (card.provinceId) {
        listings = await prisma.property.count({
          where: { isPublished: true, provinceId: card.provinceId },
        });
      }

      return {
        ...card,
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
        listings,
        imageUrl: getMediaUrl(card.imageKey),
      };
    }),
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/getHomeAreaCards.ts
git commit -m "feat(home-area-cards): add server-side getHomeAreaCards fetcher"
```

---

### Task 5: Admin UI Components

**Files:**
- Create: `app/(dashboard)/admin/pages/home/components/HomeAreaCardRow.tsx`
- Create: `app/(dashboard)/admin/pages/home/components/HomeAreaCardForm.tsx`

**Interfaces:**
- Consumes:
  - `HomeAreaCard` from `@/types/homeAreaCard`
  - `homeAreaCardFormSchema`, `HomeAreaCardFormValues` from `@/validation/homeAreaCardSchema`
  - `useRead`, `useWrite` from `@/lib/spoosh`
  - `form` from `@spoosh/core`
  - GeckoUI: `RHFInput`, `RHFSelect`, `RHFNumberInput`, `RHFError`, `SelectOption`, `ConfirmDialog`
  - `useSortable`, `CSS` from `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Produces:
  - `HomeAreaCardRow` — sortable row with expand/collapse for edit form
  - `HomeAreaCardForm` — create/edit form with image upload, location dropdowns

- [ ] **Step 1: Create HomeAreaCardRow**

Create `app/(dashboard)/admin/pages/home/components/HomeAreaCardRow.tsx`:

```typescript
"use client";

import Image from "next/image";
import { ChevronDown, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { classNames } from "@/utils/classNames";
import { getMediaUrl } from "@/utils/getMediaUrl";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import HomeAreaCardForm from "./HomeAreaCardForm";

interface HomeAreaCardRowProps {
  card: HomeAreaCard;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function HomeAreaCardRow({
  card,
  isExpanded,
  onToggle,
  onSaved,
  onDeleted,
}: HomeAreaCardRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className="flex items-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="px-3 py-4 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 pr-5 py-4 text-left hover:bg-gray-50 transition-colors min-w-0"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={getMediaUrl(card.imageKey)}
              alt={card.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{card.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {card.district
                ? `${card.district.name} district`
                : card.province
                  ? `${card.province.name} province`
                  : "No location linked"}
              {` · order ${card.order}`}
            </p>
          </div>

          <ChevronDown
            className={classNames(
              "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      {isExpanded && (
        <HomeAreaCardForm
          card={card}
          onSaved={onSaved}
          onCancel={onToggle}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create HomeAreaCardForm**

Create `app/(dashboard)/admin/pages/home/components/HomeAreaCardForm.tsx`:

```typescript
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { form } from "@spoosh/core";
import {
  ConfirmDialog,
  RHFInput,
  RHFSelect,
  RHFError,
  SelectOption,
  RHFNumberInput,
} from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { homeAreaCardFormSchema, type HomeAreaCardFormValues } from "@/validation/homeAreaCardSchema";
import type { HomeAreaCard } from "@/types/homeAreaCard";

const DEFAULT_VALUES: HomeAreaCardFormValues = {
  name: "",
  order: 0,
  provinceId: null,
  districtId: null,
};

interface HomeAreaCardFormProps {
  card: HomeAreaCard | null;
  onSaved: () => void;
  onCancel: () => void;
  onDeleted?: () => void;
}

export default function HomeAreaCardForm({ card, onSaved, onCancel, onDeleted }: HomeAreaCardFormProps) {
  const { data: provincesData } = useRead((api) => api("admin/provinces").GET());
  const provinces = provincesData?.provinces ?? [];

  const { trigger: uploadMedia } = useWrite((api) => api("admin/media").POST());
  const { trigger: createCard } = useWrite((api) => api("admin/home-area-cards").POST());
  const { trigger: updateCard } = useWrite((api) => api("admin/home-area-cards/:id").PATCH());
  const { trigger: deleteCard } = useWrite((api) => api("admin/home-area-cards/:id").DELETE());

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<HomeAreaCardFormValues>({
    values: card
      ? {
          name: card.name,
          order: card.order,
          provinceId: card.provinceId,
          districtId: card.districtId,
        }
      : DEFAULT_VALUES,
    resolver: zodResolver(homeAreaCardFormSchema),
  });

  const provinceId = methods.watch("provinceId");

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : card?.imageKey
      ? getMediaUrl(card.imageKey)
      : null;

  const handleSubmit = methods.handleSubmit(async (values) => {
    setImageError(null);

    let imageKey = card?.imageKey ?? "";

    if (imageFile) {
      const uploaded = await uploadMedia({ body: form({ file: imageFile }) });
      if (!uploaded?.key) {
        setImageError("Image upload failed. Try again.");
        return;
      }
      imageKey = uploaded.key;
    }

    if (!imageKey) {
      setImageError("Image is required.");
      return;
    }

    if (card) {
      await updateCard({ params: { id: card.id }, body: { ...values, imageKey } });
    } else {
      await createCard({ body: { ...values, imageKey } });
    }

    onSaved();
  });

  const handleDelete = () => {
    if (!card) return;
    ConfirmDialog.show({
      title: "Delete area card?",
      content: `"${card.name}" will be permanently removed from the home page.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteCard({ params: { id: card.id } });
        onDeleted?.();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="p-5 border-t border-gray-100 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <RHFInput name="name" placeholder="e.g. Sathorn" />
            <RHFError name="name" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <RHFNumberInput name="order" min={0} />
            <RHFError name="order" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <RHFSelect<string>
              name="provinceId"
              placeholder="Any province"
              onChange={() => methods.setValue("districtId", null)}
            >
              {provinces.map((p) => (
                <SelectOption key={p.id} value={p.id} label={p.name} />
              ))}
            </RHFSelect>
            <RHFError name="provinceId" />
          </div>

          {provinceId && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <RHFSelect<string> name="districtId" placeholder="Any district">
                {districts.map((d) => (
                  <SelectOption key={d.id} value={d.id} label={d.name} />
                ))}
              </RHFSelect>
              <RHFError name="districtId" />
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Area Image</label>

            <div className="flex items-start gap-4">
              {previewUrl && (
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={96}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] ?? null);
                    setImageError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-primary-700 hover:text-primary-800 px-3 py-2 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  {card ? "Change Image" : "Select Image"}
                </button>
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>
                )}
              </div>
            </div>

            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {card ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {methods.formState.isSubmitting ? "Saving..." : card ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(dashboard)/admin/pages/home/components/HomeAreaCardRow.tsx app/(dashboard)/admin/pages/home/components/HomeAreaCardForm.tsx
git commit -m "feat(home-area-cards): add admin Row and Form components"
```

---

### Task 6: Update Admin Home Page

**Files:**
- Modify: `app/(dashboard)/admin/pages/home/page.tsx`

**Interfaces:**
- Consumes: `HomeAreaCard` from `@/types/homeAreaCard`, `HomeAreaCardRow`, `HomeAreaCardForm`
- Produces: Admin page with two sections — "Property Sections" (existing) and "Locations" (new, below)

- [ ] **Step 1: Replace page.tsx**

Replace the full content of `app/(dashboard)/admin/pages/home/page.tsx` with:

```typescript
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRead, useWrite } from "@/lib/spoosh";
import type { HomeSection } from "@/types/homeSection";
import type { HomeAreaCard } from "@/types/homeAreaCard";
import AdminPageHeader from "../../components/AdminPageHeader";
import HomeSectionRow from "./components/HomeSectionRow";
import HomeSectionForm from "./components/HomeSectionForm";
import HomeAreaCardRow from "./components/HomeAreaCardRow";
import HomeAreaCardForm from "./components/HomeAreaCardForm";

export default function AdminHomePage() {
  const { data: sectionsData, loading: sectionsLoading, trigger: refetchSections } = useRead(
    (api) => api("admin/home-sections").GET(),
  );
  const { trigger: updateSection } = useWrite((api) => api("admin/home-sections/:id").PATCH());
  const [expandedSectionId, setExpandedSectionId] = useState<string | "new" | null>(null);
  const [sectionOrderIds, setSectionOrderIds] = useState<string[] | null>(null);

  const { data: cardsData, loading: cardsLoading, trigger: refetchCards } = useRead(
    (api) => api("admin/home-area-cards").GET(),
  );
  const { trigger: updateCard } = useWrite((api) => api("admin/home-area-cards/:id").PATCH());
  const [expandedCardId, setExpandedCardId] = useState<string | "new" | null>(null);
  const [cardOrderIds, setCardOrderIds] = useState<string[] | null>(null);

  const serverSections = sectionsData?.sections ?? [];
  const orderedSections: HomeSection[] = sectionOrderIds
    ? sectionOrderIds.map((id) => serverSections.find((s) => s.id === id)).filter((s): s is HomeSection => !!s)
    : serverSections;

  const serverCards = cardsData?.areaCards ?? [];
  const orderedCards: HomeAreaCard[] = cardOrderIds
    ? cardOrderIds.map((id) => serverCards.find((c) => c.id === id)).filter((c): c is HomeAreaCard => !!c)
    : serverCards;

  const handleSectionToggle = (id: string) => {
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  const handleSectionSaved = () => {
    setExpandedSectionId(null);
    setSectionOrderIds(null);
    refetchSections();
  };

  const handleSectionDeleted = () => {
    setExpandedSectionId(null);
    setSectionOrderIds(null);
    refetchSections();
  };

  const handleSectionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex((s) => s.id === active.id);
    const newIndex = orderedSections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(orderedSections, oldIndex, newIndex);

    setSectionOrderIds(reordered.map((s) => s.id));

    await Promise.all(
      reordered
        .map((section, index) =>
          section.order !== index
            ? updateSection({ params: { id: section.id }, body: { order: index } })
            : null,
        )
        .filter(Boolean),
    );
  };

  const handleCardToggle = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleCardSaved = () => {
    setExpandedCardId(null);
    setCardOrderIds(null);
    refetchCards();
  };

  const handleCardDeleted = () => {
    setExpandedCardId(null);
    setCardOrderIds(null);
    refetchCards();
  };

  const handleCardDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedCards.findIndex((c) => c.id === active.id);
    const newIndex = orderedCards.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(orderedCards, oldIndex, newIndex);

    setCardOrderIds(reordered.map((c) => c.id));

    await Promise.all(
      reordered
        .map((card, index) =>
          card.order !== index
            ? updateCard({ params: { id: card.id }, body: { order: index } })
            : null,
        )
        .filter(Boolean),
    );
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Home Page"
        description="Configure the property listing sections and area cards shown on the home page."
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Property Sections</h2>
          <button
            onClick={() => setExpandedSectionId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {sectionsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {orderedSections.length === 0 && expandedSectionId !== "new" && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No sections yet. Add your first one.</p>
              </div>
            )}

            <DndContext collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext
                items={orderedSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {orderedSections.map((section) => (
                    <HomeSectionRow
                      key={section.id}
                      section={section}
                      isExpanded={expandedSectionId === section.id}
                      onToggle={() => handleSectionToggle(section.id)}
                      onSaved={handleSectionSaved}
                      onDeleted={handleSectionDeleted}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {expandedSectionId === "new" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">New Section</p>
                </div>
                <HomeSectionForm
                  section={null}
                  onSaved={handleSectionSaved}
                  onCancel={() => setExpandedSectionId(null)}
                />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Locations</h2>
          <button
            onClick={() => setExpandedCardId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>

        {cardsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-primary-600" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {orderedCards.length === 0 && expandedCardId !== "new" && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-sm">No locations yet. Add your first one.</p>
              </div>
            )}

            <DndContext collisionDetection={closestCenter} onDragEnd={handleCardDragEnd}>
              <SortableContext
                items={orderedCards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {orderedCards.map((card) => (
                    <HomeAreaCardRow
                      key={card.id}
                      card={card}
                      isExpanded={expandedCardId === card.id}
                      onToggle={() => handleCardToggle(card.id)}
                      onSaved={handleCardSaved}
                      onDeleted={handleCardDeleted}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {expandedCardId === "new" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">New Location</p>
                </div>
                <HomeAreaCardForm
                  card={null}
                  onSaved={handleCardSaved}
                  onCancel={() => setExpandedCardId(null)}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(dashboard)/admin/pages/home/page.tsx
git commit -m "feat(home-area-cards): update admin home page with Locations section"
```

---

### Task 7: Wire Home Page to Live Data

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/components/home/mock.ts`

**Interfaces:**
- Consumes: `getHomeAreaCards` from `@/lib/getHomeAreaCards`
- Produces: `HomePage` fetches live area cards from DB; `HOME_AREA_CARDS` removed from mock

- [ ] **Step 1: Update app/page.tsx**

Replace the content of `app/page.tsx` with:

```typescript
import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "./constants";
import {
  AreaGrid,
  HomeFooter,
  HomeHeader,
  HomeHero,
  PropertySection,
  WhyExecutiveHomes,
} from "./components/home";
import { getHomeSections } from "@/lib/getHomeSections";
import { getHomeAreaCards } from "@/lib/getHomeAreaCards";

export default async function HomePage() {
  const [sections, areaCards] = await Promise.all([getHomeSections(), getHomeAreaCards()]);

  return (
    <>
      <HomeHeader navItems={HOME_NAV_ITEMS} hideLogo />
      <main className="min-h-screen bg-white">
        <HomeHero />
        <AreaGrid areas={areaCards} />
        {sections.map((section) => (
          <PropertySection key={section.title} section={section} />
        ))}
        <WhyExecutiveHomes />
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
```

Note: `ClientHomeAreaCard` satisfies `AreaCard` — it has `name`, `imageUrl`, and `listings` which is all `AreaGrid` uses.

- [ ] **Step 2: Remove HOME_AREA_CARDS from mock.ts**

In `app/components/home/mock.ts`, delete the `HOME_AREA_CARDS` export (lines 312–362) and the `AreaCard` import from the import line at top (if `AreaCard` is no longer used in that file).

- [ ] **Step 3: Run lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

Fix any errors before committing.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/components/home/mock.ts
git commit -m "feat(home-area-cards): wire home page to live area cards data"
```

---

## Verification

1. User runs `pnpm prisma migrate dev --name add-home-area-cards`
2. Start dev server: `pnpm dev`
3. Go to `/admin/pages/home` — verify "Locations" section appears below Property Sections
4. Create 2 area cards with images, linked to different provinces/districts
5. Verify cards appear in the list with image thumbnail, name, and location summary
6. Drag to reorder — verify order updates
7. Visit home page `/` — verify `AreaGrid` renders live cards (first card by order is tall/featured)
8. Confirm listing counts reflect actual published properties in linked geography
9. Edit a card (change name/image) — verify home page reflects change after save
10. Delete a card — verify it disappears from home page
