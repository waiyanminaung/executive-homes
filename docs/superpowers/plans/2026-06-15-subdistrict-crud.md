# SubDistrict CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full SubDistrict CRUD (API + admin UI), wire subdistrict select into property form, and display subdistrict in property detail page; also delete orphaned category scaffold files.

**Architecture:** SubDistrict follows the exact Province → District pattern already established — validation schema, type, API routes in `locations.routes.ts`, spoosh types, and a 3rd-level expandable row in the admin locations page. The property form location section gains a conditional SubDistrict select that resets when districtId changes. The public property detail page includes subDistrict in its Prisma query and uses it as the most-specific location label.

**Tech Stack:** Next.js 16, Hono, Prisma, React Hook Form + Zod, GeckoUI, Spoosh

---

## File Map

| Action | File |
|--------|------|
| DELETE | `validation/categoriesSchema.ts` |
| DELETE | `constants/admin/categories.ts` |
| DELETE | `app/(dashboard)/admin/categories/` (dir) |
| MODIFY | `validation/locationSchema.ts` |
| MODIFY | `types/location.ts` |
| MODIFY | `hono/routes/locations.routes.ts` |
| MODIFY | `lib/spoosh.ts` |
| MODIFY | `app/(dashboard)/admin/locations/page.tsx` |
| MODIFY | `app/(dashboard)/admin/properties/components/PropertyFormLocationSection.tsx` |
| MODIFY | `app/properties/[slug]/page.tsx` |

---

### Task 1: Delete orphaned category files

**Files:**
- Delete: `validation/categoriesSchema.ts`
- Delete: `constants/admin/categories.ts`
- Delete: `app/(dashboard)/admin/categories/` (entire directory)

- [ ] **Step 1: Remove orphaned files**

```bash
rm /Users/waiyanminaung/wyma-development/executive-homes/validation/categoriesSchema.ts
rm /Users/waiyanminaung/wyma-development/executive-homes/constants/admin/categories.ts
rm -rf "/Users/waiyanminaung/wyma-development/executive-homes/app/(dashboard)/admin/categories"
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "categoriesSchema\|categories.*Schema\|CATEGORY_NAME" /Users/waiyanminaung/wyma-development/executive-homes --include="*.ts" --include="*.tsx" -l
```

Expected: no output (no files found)

- [ ] **Step 3: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove orphaned category scaffold files"
```

---

### Task 2: Add SubDistrict validation schemas

**Files:**
- Modify: `validation/locationSchema.ts`

- [ ] **Step 1: Add subDistrict schemas to `validation/locationSchema.ts`**

Append after the existing `districtUpdateSchema` export:

```typescript
export const subDistrictCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  districtId: z.string().min(1, "District is required"),
});

export type SubDistrictCreateInput = z.infer<typeof subDistrictCreateSchema>;

export const subDistrictUpdateSchema = subDistrictCreateSchema.partial();
export type SubDistrictUpdateInput = z.infer<typeof subDistrictUpdateSchema>;
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add validation/locationSchema.ts
git commit -m "feat: add SubDistrict validation schemas"
```

---

### Task 3: Add SubDistrict type

**Files:**
- Modify: `types/location.ts`

- [ ] **Step 1: Add `SubDistrict` interface to `types/location.ts`**

Append after the `District` interface:

```typescript
export interface SubDistrict {
  id: string;
  name: string;
  slug: string;
  districtId: string;
}
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add types/location.ts
git commit -m "feat: add SubDistrict type"
```

---

### Task 4: Add SubDistrict API routes

**Files:**
- Modify: `hono/routes/locations.routes.ts`

- [ ] **Step 1: Add subDistrict imports and routes to `hono/routes/locations.routes.ts`**

Update the import at the top to include subDistrict schemas:

```typescript
import {
  provinceCreateSchema,
  provinceUpdateSchema,
  districtCreateSchema,
  districtUpdateSchema,
  subDistrictCreateSchema,
  subDistrictUpdateSchema,
} from "@/validation/locationSchema";
```

Append the following routes before the `export default locationsRoutes;` line:

```typescript
locationsRoutes.get("/subdistricts", async (c) => {
  const districtId = c.req.query("districtId");
  const subDistricts = await prisma.subDistrict.findMany({
    where: districtId ? { districtId } : undefined,
    orderBy: { name: "asc" },
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistricts });
});

locationsRoutes.post("/subdistricts", zv("json", subDistrictCreateSchema), async (c) => {
  const data = c.req.valid("json");
  const subDistrict = await prisma.subDistrict.create({
    data,
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistrict }, 201);
});

locationsRoutes.patch("/subdistricts/:id", zv("json", subDistrictUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const existing = await prisma.subDistrict.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "SubDistrict not found" }, 404);
  const subDistrict = await prisma.subDistrict.update({
    where: { id },
    data,
    include: { district: { select: { id: true, name: true } } },
  });
  return c.json({ subDistrict });
});

locationsRoutes.delete("/subdistricts/:id", async (c) => {
  const id = c.req.param("id");
  const existing = await prisma.subDistrict.findUnique({ where: { id } });
  if (!existing) return c.json({ error: "SubDistrict not found" }, 404);
  await prisma.subDistrict.delete({ where: { id } });
  return c.json({ ok: true });
});
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add hono/routes/locations.routes.ts
git commit -m "feat: add SubDistrict CRUD API routes"
```

---

### Task 5: Add SubDistrict Spoosh types

**Files:**
- Modify: `lib/spoosh.ts`

- [ ] **Step 1: Add `SubDistrict` to imports in `lib/spoosh.ts`**

Change line 11:
```typescript
import type { District } from "@/types/location";
```
To:
```typescript
import type { District, SubDistrict } from "@/types/location";
```

- [ ] **Step 2: Add `SubDistrictCreateInput` / `SubDistrictUpdateInput` to imports in `lib/spoosh.ts`**

Change line 14:
```typescript
import type { ProvinceCreateInput, ProvinceUpdateInput, DistrictCreateInput, DistrictUpdateInput } from "@/validation/locationSchema";
```
To:
```typescript
import type { ProvinceCreateInput, ProvinceUpdateInput, DistrictCreateInput, DistrictUpdateInput, SubDistrictCreateInput, SubDistrictUpdateInput } from "@/validation/locationSchema";
```

- [ ] **Step 3: Add SubDistrict API entries to `ApiSchema` in `lib/spoosh.ts`**

After the `"admin/locations/districts/:id"` block (around line 81), add:

```typescript
  "admin/locations/subdistricts": {
    GET: { data: { subDistricts: (SubDistrict & { district: { id: string; name: string } })[] }; query?: { districtId?: string } };
    POST: { data: { subDistrict: SubDistrict & { district: { id: string; name: string } } }; body: SubDistrictCreateInput };
  };
  "admin/locations/subdistricts/:id": {
    PATCH: { data: { subDistrict: SubDistrict & { district: { id: string; name: string } } }; params: { id: string }; body: SubDistrictUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
```

- [ ] **Step 4: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add lib/spoosh.ts
git commit -m "feat: add SubDistrict Spoosh API types"
```

---

### Task 6: Add SubDistrict to admin locations UI

**Files:**
- Modify: `app/(dashboard)/admin/locations/page.tsx`

The current page is ~328 lines. SubDistrict adds a 3rd expand level under each District row. The pattern mirrors the existing District-under-Province pattern exactly.

- [ ] **Step 1: Replace the full contents of `app/(dashboard)/admin/locations/page.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ConfirmDialog, Dialog, Spinner, RHFInput, RHFError, RHFSelect, SelectOption } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRead, useWrite } from "@/lib/spoosh";
import {
  provinceCreateSchema,
  districtCreateSchema,
  subDistrictCreateSchema,
} from "@/validation/locationSchema";
import { useSlugAutoFill } from "@/utils/useSlugAutoFill";
import { SlugInput } from "@/components/SlugInput";
import type { Province, District, SubDistrict } from "@/types/location";
import AdminPageHeader from "../components/AdminPageHeader";

function ProvinceFormFields() {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="Bangkok" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="bangkok" />
    </div>
  );
}

function DistrictFormFields({ provinces }: { provinces: Province[] }) {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="Watthana" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="watthana" />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <RHFSelect<string> name="provinceId" placeholder="Select province...">
          {provinces.map((p) => (
            <SelectOption key={p.id} value={p.id} label={p.name} />
          ))}
        </RHFSelect>
        <RHFError name="provinceId" />
      </div>
    </div>
  );
}

function SubDistrictFormFields({ districts }: { districts: (District & { province: { id: string; name: string } })[] }) {
  const { onBlur: handleNameBlur } = useSlugAutoFill("name");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <RHFInput name="name" placeholder="Khlong Toei Nuea" onBlur={handleNameBlur} />
        <RHFError name="name" />
      </div>
      <SlugInput placeholder="khlong-toei-nuea" />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">District</label>
        <RHFSelect<string> name="districtId" placeholder="Select district...">
          {districts.map((d) => (
            <SelectOption key={d.id} value={d.id} label={`${d.province.name} › ${d.name}`} />
          ))}
        </RHFSelect>
        <RHFError name="districtId" />
      </div>
    </div>
  );
}

function ProvinceForm({
  editing,
  onSaved,
  onCancel,
}: {
  editing: Province | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/locations/provinces").POST());
  const { trigger: update } = useWrite((api) => api("admin/locations/provinces/:id").PATCH());

  const methods = useForm({
    values: editing ? { name: editing.name, slug: editing.slug } : { name: "", slug: "" },
    resolver: zodResolver(provinceCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await update({ params: { id: editing.id }, body: values });
    } else {
      await create({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit Province" : "Add Province"}</h3>
        <ProvinceFormFields />
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={methods.formState.isSubmitting} className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function DistrictForm({
  editing,
  provinces,
  defaultProvinceId,
  onSaved,
  onCancel,
}: {
  editing: (District & { province: { id: string; name: string } }) | null;
  provinces: Province[];
  defaultProvinceId?: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/locations/districts").POST());
  const { trigger: update } = useWrite((api) => api("admin/locations/districts/:id").PATCH());

  const methods = useForm({
    values: editing
      ? { name: editing.name, slug: editing.slug, provinceId: editing.provinceId }
      : { name: "", slug: "", provinceId: defaultProvinceId ?? "" },
    resolver: zodResolver(districtCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await update({ params: { id: editing.id }, body: values });
    } else {
      await create({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit District" : "Add District"}</h3>
        <DistrictFormFields provinces={provinces} />
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={methods.formState.isSubmitting} className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function SubDistrictForm({
  editing,
  districts,
  defaultDistrictId,
  onSaved,
  onCancel,
}: {
  editing: (SubDistrict & { district: { id: string; name: string } }) | null;
  districts: (District & { province: { id: string; name: string } })[];
  defaultDistrictId?: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { trigger: create } = useWrite((api) => api("admin/locations/subdistricts").POST());
  const { trigger: update } = useWrite((api) => api("admin/locations/subdistricts/:id").PATCH());

  const methods = useForm({
    values: editing
      ? { name: editing.name, slug: editing.slug, districtId: editing.districtId }
      : { name: "", slug: "", districtId: defaultDistrictId ?? "" },
    resolver: zodResolver(subDistrictCreateSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (editing) {
      await update({ params: { id: editing.id }, body: values });
    } else {
      await create({ body: values });
    }
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">{editing ? "Edit Subdistrict" : "Add Subdistrict"}</h3>
        <SubDistrictFormFields districts={districts} />
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={methods.formState.isSubmitting} className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
            {methods.formState.isSubmitting ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function AdminLocationsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});

  const { data: provData, loading: provLoading, trigger: refetchProvinces } = useRead((api) => api("admin/locations/provinces").GET());
  const { data: distData, loading: distLoading, trigger: refetchDistricts } = useRead((api) => api("admin/locations/districts").GET());
  const { data: subDistData, loading: subDistLoading, trigger: refetchSubDistricts } = useRead((api) => api("admin/locations/subdistricts").GET());
  const { trigger: deleteProvince } = useWrite((api) => api("admin/locations/provinces/:id").DELETE());
  const { trigger: deleteDistrict } = useWrite((api) => api("admin/locations/districts/:id").DELETE());
  const { trigger: deleteSubDistrict } = useWrite((api) => api("admin/locations/subdistricts/:id").DELETE());

  const provinces = provData?.provinces ?? [];
  const districts = distData?.districts ?? [];
  const subDistricts = subDistData?.subDistricts ?? [];

  const getDistricts = (provinceId: string) => districts.filter((d) => d.provinceId === provinceId);
  const getSubDistricts = (districtId: string) => subDistricts.filter((s) => s.districtId === districtId);

  const refetchAll = () => { refetchProvinces(); refetchDistricts(); refetchSubDistricts(); };

  const openProvinceForm = (editing: Province | null = null) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <ProvinceForm editing={editing} onSaved={() => { dismiss(); refetchAll(); }} onCancel={dismiss} />
      ),
    });
  };

  const openDistrictForm = (
    editing: (District & { province: { id: string; name: string } }) | null = null,
    defaultProvinceId?: string,
  ) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <DistrictForm
          editing={editing}
          provinces={provinces}
          defaultProvinceId={defaultProvinceId}
          onSaved={() => { dismiss(); refetchAll(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const openSubDistrictForm = (
    editing: (SubDistrict & { district: { id: string; name: string } }) | null = null,
    defaultDistrictId?: string,
  ) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <SubDistrictForm
          editing={editing}
          districts={districts}
          defaultDistrictId={defaultDistrictId}
          onSaved={() => { dismiss(); refetchAll(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const handleDeleteProvince = (province: Province) => {
    ConfirmDialog.show({
      title: "Delete province?",
      content: `"${province.name}" and all its districts and subdistricts will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteProvince({ params: { id: province.id } });
        refetchAll();
      },
    });
  };

  const handleDeleteDistrict = (district: District & { province: { id: string; name: string } }) => {
    ConfirmDialog.show({
      title: "Delete district?",
      content: `"${district.name}" and all its subdistricts will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteDistrict({ params: { id: district.id } });
        refetchAll();
      },
    });
  };

  const handleDeleteSubDistrict = (subDistrict: SubDistrict & { district: { id: string; name: string } }) => {
    ConfirmDialog.show({
      title: "Delete subdistrict?",
      content: `"${subDistrict.name}" will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteSubDistrict({ params: { id: subDistrict.id } });
        refetchSubDistricts();
      },
    });
  };

  const loading = provLoading || distLoading || subDistLoading;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Locations"
        description="Manage provinces, districts, and subdistricts."
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => openProvinceForm()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Province
            </button>
            <button
              onClick={() => openDistrictForm()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              District
            </button>
            <button
              onClick={() => openSubDistrictForm()}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Subdistrict
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {provinces.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No provinces yet. Add your first one.</p>
            </div>
          ) : (
            provinces.map((province) => {
              const isProvinceOpen = expanded[province.id] ?? false;
              const provinceDistricts = getDistricts(province.id);

              return (
                <div key={province.id}>
                  <div className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [province.id]: !isProvinceOpen }))}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isProvinceOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm font-semibold text-gray-900">{province.name}</span>
                      <span className="text-xs text-gray-600 font-mono ml-1">{province.slug}</span>
                      <span className="ml-2 text-xs text-gray-600">{provinceDistricts.length} districts</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openDistrictForm(null, province.id)}
                        className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Add district"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openProvinceForm(province)}
                        className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProvince(province)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isProvinceOpen && (
                    <div className="pl-10 pr-4 pb-2 space-y-0.5 bg-gray-50">
                      {provinceDistricts.length === 0 ? (
                        <p className="text-xs text-gray-500 py-2">No districts yet.</p>
                      ) : (
                        provinceDistricts.map((district) => {
                          const isDistrictOpen = expandedDistricts[district.id] ?? false;
                          const districtSubDistricts = getSubDistricts(district.id);

                          return (
                            <div key={district.id}>
                              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <button
                                  onClick={() => setExpandedDistricts((prev) => ({ ...prev, [district.id]: !isDistrictOpen }))}
                                  className="flex items-center gap-2 flex-1 text-left"
                                >
                                  {isDistrictOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                                  <span className="text-sm text-gray-700">{district.name}</span>
                                  <span className="text-xs text-gray-600 font-mono">{district.slug}</span>
                                  <span className="text-xs text-gray-500">{districtSubDistricts.length} subdistricts</span>
                                </button>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openSubDistrictForm(null, district.id)}
                                    className="p-1 text-gray-500 hover:text-primary-700 rounded hover:bg-gray-200 transition-colors"
                                    title="Add subdistrict"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openDistrictForm(district)}
                                    className="p-1 text-gray-500 hover:text-primary-700 rounded hover:bg-gray-200 transition-colors"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDistrict(district)}
                                    className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-200 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {isDistrictOpen && (
                                <div className="pl-8 pr-2 pb-1 space-y-0.5">
                                  {districtSubDistricts.length === 0 ? (
                                    <p className="text-xs text-gray-500 py-1.5">No subdistricts yet.</p>
                                  ) : (
                                    districtSubDistricts.map((subDistrict) => (
                                      <div key={subDistrict.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-600">{subDistrict.name}</span>
                                          <span className="text-xs text-gray-500 font-mono">{subDistrict.slug}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => openSubDistrictForm(subDistrict)}
                                            className="p-1 text-gray-500 hover:text-primary-700 rounded hover:bg-gray-200 transition-colors"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteSubDistrict(subDistrict)}
                                            className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-200 transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/admin/locations/page.tsx"
git commit -m "feat: add SubDistrict CRUD to admin locations UI"
```

---

### Task 7: Add SubDistrict select to property form

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormLocationSection.tsx`

The existing component uses `useEffect` to reset `districtId` on `provinceId` change (line 26-28). Add the same pattern for `subDistrictId` when `districtId` changes. Note: `useEffect` for resetting dependent selects is existing project convention in this file — follow it.

- [ ] **Step 1: Replace full contents of `PropertyFormLocationSection.tsx`**

```typescript
"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RHFInput, RHFSelect, RHFError, SelectOption } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import type { Province } from "@/types/property";
import type { PropertyCreateInput } from "@/validation/propertySchema";

interface PropertyFormLocationSectionProps {
  provinces: Province[];
}

export default function PropertyFormLocationSection({ provinces }: PropertyFormLocationSectionProps) {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const lat = watch("lat");
  const lng = watch("lng");
  const provinceId = watch("provinceId");
  const districtId = watch("districtId");
  const hasCoords = lat != null && lng != null;

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const { data: subDistrictsData } = useRead((api) =>
    api("admin/locations/subdistricts").GET({ query: districtId ? { districtId } : undefined }),
  );
  const subDistricts = subDistrictsData?.subDistricts ?? [];

  useEffect(() => {
    setValue("districtId", null);
    setValue("subDistrictId", null);
  }, [provinceId, setValue]);

  useEffect(() => {
    setValue("subDistrictId", null);
  }, [districtId, setValue]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Location</h2>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <RHFInput name="address" placeholder="Street address, building name..." />
        <RHFError name="address" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <RHFSelect<string> name="provinceId" placeholder="Select province...">
          {provinces.map((p) => (
            <SelectOption key={p.id} value={p.id} label={p.name} />
          ))}
        </RHFSelect>
        <RHFError name="provinceId" />
      </div>

      {provinceId && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">District</label>
          <RHFSelect<string> name="districtId" placeholder="Select district...">
            {districts.map((d) => (
              <SelectOption key={d.id} value={d.id} label={d.name} />
            ))}
          </RHFSelect>
          <RHFError name="districtId" />
        </div>
      )}

      {districtId && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Subdistrict</label>
          <RHFSelect<string> name="subDistrictId" placeholder="Select subdistrict...">
            {subDistricts.map((s) => (
              <SelectOption key={s.id} value={s.id} label={s.name} />
            ))}
          </RHFSelect>
          <RHFError name="subDistrictId" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <RHFInput name="lat" placeholder="e.g. 13.7563" type="number" step="any" />
          <RHFError name="lat" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <RHFInput name="lng" placeholder="e.g. 100.5018" type="number" step="any" />
          <RHFError name="lng" />
        </div>
      </div>

      {hasCoords && (
        <div className="rounded-lg overflow-hidden border border-gray-200 h-56">
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Map Image URL (optional)</label>
        <RHFInput name="mapImageUrl" placeholder="https://..." />
        <RHFError name="mapImageUrl" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/admin/properties/components/PropertyFormLocationSection.tsx"
git commit -m "feat: add subdistrict select to property form location section"
```

---

### Task 8: Show subdistrict in property detail page

**Files:**
- Modify: `app/properties/[slug]/page.tsx`

- [ ] **Step 1: Update Prisma query to include subDistrict and update locationLabel**

In `app/properties/[slug]/page.tsx`, update the `prisma.property.findUnique` call to include `subDistrict`, and update `locationLabel` to prefer the most specific location:

Change the `include` block (lines 29-36):
```typescript
    include: {
      propertyType: true,
      images: { orderBy: { order: "asc" } },
      features: { include: { feature: true } },
      transitStations: { include: { station: true } },
      province: { select: { name: true } },
      district: { select: { name: true } },
      subDistrict: { select: { name: true } },
    },
```

Change `locationLabel` (line 43):
```typescript
  const locationLabel = raw.subDistrict?.name ?? raw.district?.name ?? raw.province?.name ?? raw.address;
```

- [ ] **Step 2: Lint + typecheck**

```bash
cd /Users/waiyanminaung/wyma-development/executive-homes && pnpm lint && pnpm typecheck
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add "app/properties/[slug]/page.tsx"
git commit -m "feat: include subdistrict in property detail location label"
```
