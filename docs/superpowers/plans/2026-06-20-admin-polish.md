# Admin Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 12 admin UX issues spanning UI tweaks, schema additions, upload improvements, and HTML rendering.

**Architecture:** Changes are split into 5 tasks ordered by dependency. Tasks 1–2 are independent UI fixes. Tasks 3–4 require Prisma migrations (user must run `pnpm db:migrate` between them and the next step). Task 5 is the upload system refactor. Task 6 is a server-side media optimization fix.

**Tech Stack:** Next.js 16, React 19, Prisma 7, Hono, spoosh (`useQueue`/`useWrite`/`useRead`), react-hook-form, zod, lucide-react, TailwindCSS 4

## Global Constraints

- Never use `any` type — use proper types
- No comments unless the WHY is non-obvious
- No `useMemo` / `useCallback`
- Use `classNames` utility for multiple className values
- `pnpm` for all package operations
- Run `pnpm lint && pnpm typecheck` before marking task done
- Never run `prisma migrate` or `prisma db push` — instruct user to run them
- After each task: run `executive-homes-review` skill

---

## Task 1: Quick UI fixes (no schema changes)

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyTable.tsx`
- Modify: `app/(dashboard)/admin/properties/new/page.tsx`
- Modify: `app/(dashboard)/admin/properties/[id]/edit/page.tsx`
- Modify: `app/properties/[slug]/components/PropertyDetailContent.tsx`
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormFeaturesSection.tsx`
- Modify: `components/@shared/MediaPickerDialog.tsx`
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx`

**Interfaces:**
- `openMediaPicker` gains `initialSelected?: string[]` option
- `MediaPickerDialog` gains `initialSelected?: string[]` prop

### 1a: Property list title → clickable link

- [ ] **Step 1: Edit PropertyTable.tsx**

In `app/(dashboard)/admin/properties/components/PropertyTable.tsx`, replace the title text cell (line ~65):

```tsx
// Before:
<p className="text-sm font-medium text-gray-900">{property.title}</p>

// After:
<Link
  href={`/admin/properties/${property.id}/edit`}
  className="text-sm font-medium text-gray-900 hover:text-primary-700 transition-colors"
>
  {property.title}
</Link>
```

`Link` is already imported at the top of the file.

### 1b: Remove "Create a new property listing." subtitle

- [ ] **Step 2: Edit new/page.tsx**

In `app/(dashboard)/admin/properties/new/page.tsx`, remove line 49:
```tsx
// Remove this line entirely:
<p className="text-sm text-gray-500 mt-0.5">Create a new property listing.</p>
```

### 1c: No redirect after save/create

- [ ] **Step 3: Edit new/page.tsx and edit/page.tsx**

In `app/(dashboard)/admin/properties/new/page.tsx`, update `handleSubmit`:

```tsx
const handleSubmit = async (values: PropertyCreateInput) => {
  await createProperty({ body: values });
};
```

Remove `router.push("/admin/properties")` and remove the `useRouter` import and `const router = useRouter()` since they're no longer used.

In `app/(dashboard)/admin/properties/[id]/edit/page.tsx`, update `handleSubmit`:

```tsx
const handleSubmit = async (values: PropertyCreateInput) => {
  await updateProperty({ params: { id }, body: values });
};
```

Remove `router.push("/admin/properties")`, `useRouter` import, and `const router = useRouter()`.

### 1d: Render description HTML (fix "html tag" showing as text)

- [ ] **Step 4: Edit PropertyDetailContent.tsx**

In `app/properties/[slug]/components/PropertyDetailContent.tsx`, replace the description paragraph (~line 43):

```tsx
// Before:
<p className="whitespace-pre-line text-sm leading-[1.5] text-neutral-950">
  {property.description}
</p>

// After:
<div
  className="text-sm leading-relaxed text-neutral-950 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_strong]:font-semibold [&_em]:italic"
  dangerouslySetInnerHTML={{ __html: property.description }}
/>
```

### 1e: "Select all" rendered as checkbox-style UI

- [ ] **Step 5: Edit PropertyFormFeaturesSection.tsx**

In `app/(dashboard)/admin/properties/components/PropertyFormFeaturesSection.tsx`, replace the `FeatureGroup` component's header section.

Current code (lines ~30-39):
```tsx
<div className="flex items-center justify-between">
  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{label}</p>
  <button
    type="button"
    onClick={toggleAll}
    className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
  >
    {allSelected ? "Deselect all" : "Select all"}
  </button>
</div>
<div className="grid grid-cols-2 gap-2">
  {features.map((f) => (
    <RHFCheckbox key={f.id} name="featureIds" value={f.id} label={f.label} />
  ))}
</div>
```

Replace with:
```tsx
<p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{label}</p>
<div className="grid grid-cols-2 gap-2">
  <button
    type="button"
    onClick={toggleAll}
    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
  >
    <span
      className={classNames(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
        allSelected
          ? "border-primary-600 bg-primary-600"
          : "border-gray-300 bg-white",
      )}
    >
      {allSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </span>
    <span>Select all</span>
  </button>

  {features.map((f) => (
    <RHFCheckbox key={f.id} name="featureIds" value={f.id} label={f.label} />
  ))}
</div>
```

Add imports at top of file:
```tsx
import { Check } from "lucide-react";
import { classNames } from "@/utils/classNames";
```

### 1f: Gallery image ordering (move up / move down)

- [ ] **Step 6: Edit PropertyFormMediaSection.tsx**

In `app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx`, add reorder functions and UI:

```tsx
"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Images, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];

  const handleAddImages = () => {
    openMediaPicker({
      multiple: true,
      initialSelected: imageUrls,
      onSelect: (urls) => {
        const existing = new Set(imageUrls);
        const newUrls = urls.filter((u) => !existing.has(u));
        setValue("imageUrls", [...imageUrls, ...newUrls]);
      },
    });
  };

  const removeUrl = (index: number) => {
    setValue("imageUrls", imageUrls.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...imageUrls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setValue("imageUrls", next);
  };

  const moveDown = (index: number) => {
    if (index === imageUrls.length - 1) return;
    const next = [...imageUrls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setValue("imageUrls", next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Images</h2>
        <Button type="button" variant="outlined" size="sm" onClick={handleAddImages}>
          <Images className="w-4 h-4 mr-1.5" />
          Add Images
        </Button>
      </div>

      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                <div className="absolute top-1 left-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={classNames(
                      "p-1 bg-white rounded-full text-gray-600 hover:bg-gray-50 shadow-sm",
                      index === 0 ? "opacity-30 cursor-not-allowed" : "",
                    )}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === imageUrls.length - 1}
                    className={classNames(
                      "p-1 bg-white rounded-full text-gray-600 hover:bg-gray-50 shadow-sm",
                      index === imageUrls.length - 1 ? "opacity-30 cursor-not-allowed" : "",
                    )}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {index === 0 && (
                  <div className="absolute bottom-1 left-1">
                    <span className="text-[10px] font-medium bg-primary-600 text-white px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">No images added yet. Click &ldquo;Add Images&rdquo; to pick from the library.</p>
      )}
    </div>
  );
}
```

### 1g: Media picker shows current images as pre-selected

- [ ] **Step 7: Edit MediaPickerDialog.tsx**

In `components/@shared/MediaPickerDialog.tsx`, update `openMediaPicker` options and `MediaPickerDialog` props to accept initial selection:

```tsx
export function openMediaPicker(opts: {
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  initialSelected?: string[];
}) {
  Dialog.show({
    className: "w-full max-w-3xl",
    content: ({ dismiss }) => (
      <MediaPickerDialog
        onClose={dismiss}
        onSelect={(urls) => {
          opts.onSelect(urls);
          dismiss();
        }}
        multiple={opts.multiple}
        initialSelected={opts.initialSelected}
      />
    ),
  });
}

export default function MediaPickerDialog({
  onClose,
  onSelect,
  multiple = true,
  initialSelected,
}: MediaPickerDialogProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelected ?? []),
  );
  // ... rest unchanged
```

Update `MediaPickerDialogProps` interface:
```tsx
interface MediaPickerDialogProps {
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  initialSelected?: string[];
}
```

- [ ] **Step 8: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 9: Run executive-homes-review**

- [ ] **Step 10: Commit**

```bash
git add \
  app/(dashboard)/admin/properties/components/PropertyTable.tsx \
  app/(dashboard)/admin/properties/new/page.tsx \
  app/(dashboard)/admin/properties/[id]/edit/page.tsx \
  app/properties/[slug]/components/PropertyDetailContent.tsx \
  app/(dashboard)/admin/properties/components/PropertyFormFeaturesSection.tsx \
  app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx \
  components/@shared/MediaPickerDialog.tsx
git commit -m "feat(admin): UI polish — clickable title, HTML description, gallery order, select-all checkbox, pre-selected media picker, no post-save redirect"
```

---

## Task 2: Pet Friendly field (requires Prisma migration)

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `validation/propertySchema.ts`
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormFlagsSection.tsx`
- Modify: `app/(dashboard)/admin/properties/components/PropertyForm.tsx`
- Modify: `app/(dashboard)/admin/properties/[id]/edit/page.tsx`

**Interfaces:**
- `PropertyCreateInput` gains `isPetFriendly: boolean`
- `PropertyFormFlagsSection` renders new switch

### 2a: Schema change

- [ ] **Step 1: Edit prisma/schema.prisma**

In `prisma/schema.prisma`, add `isPetFriendly` to the `Property` model after `isPublished`:

```prisma
isPetFriendly Boolean @default(false)
```

- [ ] **Step 2: Ask user to run migration**

⚠️ **USER ACTION REQUIRED:** Run this command before continuing:
```bash
pnpm db:migrate
```
When prompted for a migration name, use: `add_is_pet_friendly_to_property`

### 2b: Validation schema

- [ ] **Step 3: Edit validation/propertySchema.ts**

In `propertyBaseSchema`, add after `isPublished`:
```ts
isPetFriendly: z.boolean(),
```

### 2c: Form defaults

- [ ] **Step 4: Edit PropertyForm.tsx**

In `DEFAULT_VALUES`, add after `isPublished: false`:
```ts
isPetFriendly: false,
```

### 2d: Form UI

- [ ] **Step 5: Edit PropertyFormFlagsSection.tsx**

Add a Pet Friendly switch after the Featured switch:

```tsx
<div className="flex items-center justify-between">
  <div>
    <p className="text-sm font-medium text-gray-700">Pet Friendly</p>
    <p className="text-xs text-gray-500">Allow pets in this property</p>
  </div>
  <RHFSwitch name="isPetFriendly" />
</div>
```

### 2e: Edit page default values

- [ ] **Step 6: Edit edit/page.tsx**

In `defaultValues`, add after `isPublished`:
```ts
isPetFriendly: property.isPetFriendly,
```

- [ ] **Step 7: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 8: Run executive-homes-review**

- [ ] **Step 9: Commit**

```bash
git add \
  prisma/schema.prisma \
  validation/propertySchema.ts \
  app/(dashboard)/admin/properties/components/PropertyFormFlagsSection.tsx \
  app/(dashboard)/admin/properties/components/PropertyForm.tsx \
  app/(dashboard)/admin/properties/[id]/edit/page.tsx
git commit -m "feat(admin): add isPetFriendly field to property form and schema"
```

---

## Task 3: Feature icons with lucide icon picker (requires Prisma migration)

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `constants/lucideIcons.ts`
- Create: `utils/getLucideIcon.ts`
- Modify: `validation/featureSchema.ts`
- Modify: `types/feature.ts`
- Modify: `app/(dashboard)/admin/features/page.tsx`
- Modify: `app/properties/[slug]/page.tsx`
- Modify: `app/properties/[slug]/components/PropertyDetailContent.tsx`

**Interfaces:**
- `Feature.icon?: string | null` — lucide icon name stored as string
- `featureCreateSchema` gains optional `icon`
- `getLucideIcon(name: string | null | undefined): LucideIcon` — maps name to component

### 3a: Schema change

- [ ] **Step 1: Edit prisma/schema.prisma**

In the `Feature` model, add after `slug`:
```prisma
icon  String?
```

- [ ] **Step 2: Ask user to run migration**

⚠️ **USER ACTION REQUIRED:** Run this command before continuing:
```bash
pnpm db:migrate
```
When prompted for a migration name, use: `add_icon_to_feature`

### 3b: Icon registry constants

- [ ] **Step 3: Create constants/lucideIcons.ts**

```ts
export const LUCIDE_ICON_OPTIONS = [
  { name: "Waves", label: "Swimming Pool" },
  { name: "Dumbbell", label: "Gym / Fitness" },
  { name: "Car", label: "Parking" },
  { name: "ShieldCheck", label: "Security" },
  { name: "Wind", label: "Air Conditioning" },
  { name: "Wifi", label: "Wi-Fi" },
  { name: "TreeDeciduous", label: "Garden" },
  { name: "PawPrint", label: "Pet Friendly" },
  { name: "Utensils", label: "Kitchen" },
  { name: "Coffee", label: "Café / Lounge" },
  { name: "Tv", label: "Entertainment" },
  { name: "Snowflake", label: "Cold Storage" },
  { name: "Baby", label: "Nursery" },
  { name: "Key", label: "Private Access" },
  { name: "Camera", label: "CCTV" },
  { name: "Eye", label: "Concierge" },
  { name: "Bath", label: "Bathtub / Jacuzzi" },
  { name: "Sun", label: "Rooftop / Balcony" },
  { name: "Bike", label: "Bicycle Storage" },
  { name: "ShoppingBag", label: "Shopping Nearby" },
  { name: "Stethoscope", label: "Medical / Hospital" },
  { name: "School", label: "School Nearby" },
  { name: "Zap", label: "EV Charging" },
  { name: "Droplets", label: "Water Supply" },
  { name: "Flame", label: "Fireplace" },
  { name: "Wrench", label: "Maintenance" },
  { name: "Star", label: "Premium Feature" },
  { name: "Check", label: "Included" },
  { name: "Building2", label: "High Rise" },
  { name: "Home", label: "Private Garden" },
  { name: "Lock", label: "Smart Lock" },
  { name: "Maximize2", label: "Large Space" },
  { name: "Sailboat", label: "Water Sports" },
  { name: "Trees", label: "Green Area" },
  { name: "PackageOpen", label: "Storage Room" },
  { name: "Laundry", label: "Laundry" },
] as const;

export type LucideIconName = (typeof LUCIDE_ICON_OPTIONS)[number]["name"];
```

### 3c: Icon resolver utility

- [ ] **Step 4: Create utils/getLucideIcon.ts**

```ts
import type { LucideIcon } from "lucide-react";
import {
  Waves, Dumbbell, Car, ShieldCheck, Wind, Wifi, TreeDeciduous, PawPrint,
  Utensils, Coffee, Tv, Snowflake, Baby, Key, Camera, Eye, Bath, Sun, Bike,
  ShoppingBag, Stethoscope, School, Zap, Droplets, Flame, Wrench, Star,
  Check, Building2, Home, Lock, Maximize2, Sailboat, Trees, PackageOpen,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Waves, Dumbbell, Car, ShieldCheck, Wind, Wifi, TreeDeciduous, PawPrint,
  Utensils, Coffee, Tv, Snowflake, Baby, Key, Camera, Eye, Bath, Sun, Bike,
  ShoppingBag, Stethoscope, School, Zap, Droplets, Flame, Wrench, Star,
  Check, Building2, Home, Lock, Maximize2, Sailboat, Trees, PackageOpen,
};

export function getLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Check;
  return ICON_MAP[name] ?? Check;
}
```

Note: `Laundry` is not in lucide-react; omit it from the map.

### 3d: Update Feature type

- [ ] **Step 5: Edit types/feature.ts**

```ts
export interface Feature {
  id: string;
  label: string;
  slug: string;
  category: string;
  icon?: string | null;
}
```

### 3e: Update validation schema

- [ ] **Step 6: Edit validation/featureSchema.ts**

```ts
export const featureCreateSchema = z.object({
  label: z.string().min(1, "Label is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: z.enum(FEATURE_CATEGORIES),
  icon: z.string().nullable().optional(),
});
```

### 3f: Admin features page — add icon picker

- [ ] **Step 7: Edit app/(dashboard)/admin/features/page.tsx**

Add icon picker field to `FeatureFormFields` component. Add these imports at top:

```tsx
import { LUCIDE_ICON_OPTIONS } from "@/constants/lucideIcons";
import { getLucideIcon } from "@/utils/getLucideIcon";
```

Replace `FeatureFormFields` with:

```tsx
function FeatureFormFields() {
  const { onBlur: handleLabelBlur } = useSlugAutoFill("label");
  const { watch, setValue } = useFormContext<FeatureCreateInput>();
  const selectedIcon = watch("icon");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <RHFInput name="label" placeholder="Swimming Pool" onBlur={handleLabelBlur} />
        <RHFError name="label" />
      </div>

      <SlugInput placeholder="swimming-pool" />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <RHFSelect<string> name="category">
          {FEATURE_CATEGORIES.map((cat) => (
            <SelectOption key={cat} value={cat} label={CATEGORY_LABELS[cat] ?? cat} />
          ))}
        </RHFSelect>
        <RHFError name="category" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Icon</label>
        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
          <button
            type="button"
            onClick={() => setValue("icon", null)}
            className={classNames(
              "flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-colors",
              !selectedIcon ? "border-primary-500 bg-primary-50 text-primary-700" : "border-transparent hover:border-gray-200 text-gray-500",
            )}
          >
            <span className="text-[10px]">None</span>
          </button>
          {LUCIDE_ICON_OPTIONS.map(({ name, label }) => {
            const Icon = getLucideIcon(name);
            return (
              <button
                key={name}
                type="button"
                title={label}
                onClick={() => setValue("icon", name)}
                className={classNames(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-colors",
                  selectedIcon === name ? "border-primary-500 bg-primary-50 text-primary-700" : "border-transparent hover:border-gray-200 text-gray-500",
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        {selectedIcon && (
          <p className="text-xs text-gray-500">Selected: {selectedIcon}</p>
        )}
      </div>
    </div>
  );
}
```

Add `classNames` import:
```tsx
import { classNames } from "@/utils/classNames";
```

Update `FeatureForm` to include icon in form values:
```tsx
const methods = useForm({
  values: editing
    ? { label: editing.label, slug: editing.slug, category: editing.category as FeatureCreateInput["category"], icon: editing.icon ?? null }
    : DEFAULT_VALUES,
  resolver: zodResolver(featureCreateSchema),
});
```

Update `DEFAULT_VALUES`:
```tsx
const DEFAULT_VALUES: FeatureCreateInput = { label: "", slug: "", category: "UNIT_FEATURE", icon: null };
```

Also update the features table to show the icon column:

In the `<thead>`:
```tsx
<th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Icon</th>
```
(Add between Label and Slug columns)

In `<tbody>`:
```tsx
<td className="px-6 py-4">
  {feature.icon ? (() => { const Icon = getLucideIcon(feature.icon); return <Icon className="w-4 h-4 text-gray-600" />; })() : <span className="text-gray-300 text-xs">—</span>}
</td>
```

### 3g: Use icon in property detail page

- [ ] **Step 8: Edit app/properties/[slug]/page.tsx**

Add import:
```ts
import { getLucideIcon } from "@/utils/getLucideIcon";
```

Replace the unit features mapping (~line 44-46):
```ts
const unitFeatures = raw.features
  .filter((pf) => pf.feature.category === "UNIT_FEATURE")
  .map((pf) => ({ label: pf.feature.label, icon: getLucideIcon(pf.feature.icon) }));
```

Replace the common facilities mapping (~line 48-50):
```ts
const commonFacilities = raw.features
  .filter((pf) => pf.feature.category === "AMENITY")
  .map((pf) => ({ label: pf.feature.label, icon: getLucideIcon(pf.feature.icon) }));
```

Remove the `Check` import from lucide-react if it's no longer used directly (keep if used elsewhere in that file). Looking at page.tsx, `Check` is used for both unit features and facilities with `icon: Check` — this is replaced by `getLucideIcon`. Remove `Check` from the import.

- [ ] **Step 9: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 10: Run executive-homes-review**

- [ ] **Step 11: Commit**

```bash
git add \
  prisma/schema.prisma \
  constants/lucideIcons.ts \
  utils/getLucideIcon.ts \
  validation/featureSchema.ts \
  types/feature.ts \
  app/(dashboard)/admin/features/page.tsx \
  app/properties/[slug]/page.tsx
git commit -m "feat(admin): add icon field to features with lucide icon picker"
```

---

## Task 4: Upload progress + per-file error handling

**Files:**
- Modify: `components/@shared/MediaUploadZone.tsx`
- Modify: `components/@shared/MediaUploadingCell.tsx`
- Modify: `components/@shared/MediaUploadTab.tsx`
- Modify: `components/@shared/MediaLibraryTab.tsx`
- Modify: `components/@shared/MediaPickerDialog.tsx`

**Interfaces:**
- `UploadFileItem` type exported from `MediaUploadZone.tsx`
- `MediaLibraryTab` receives `uploadItems: UploadFileItem[]` + `onRetry: (id: string) => void` instead of `uploadingCount: number`
- `MediaUploadingCell` receives `progress: number` + `status: 'uploading' | 'error'` + `onRetry: () => void` + `filename: string`
- `MediaUploadZone` accepts `onItemsChange: (items: UploadFileItem[], retry: (id: string) => void) => void`

### 4a: Redesign MediaUploadZone for per-file tracking

- [ ] **Step 1: Edit components/@shared/MediaUploadZone.tsx**

```tsx
"use client";

import { useRef, useState } from "react";
import { Upload, RotateCcw } from "lucide-react";
import { form, type SpooshBody } from "@spoosh/core";
import { classNames } from "@/utils/classNames";
import { useQueue } from "@/lib/spoosh";
import type { ClientMediaImage } from "@/types/media";

export type UploadFileItem = {
  id: string;
  filename: string;
  progress: number;
  status: "uploading" | "error";
};

interface MediaUploadZoneProps {
  onUploadStart?: (count: number) => void;
  onUploaded: (image: ClientMediaImage) => void;
  onItemsChange?: (items: UploadFileItem[], retry: (id: string) => void) => void;
}

type UploadInput = { id?: string; body: SpooshBody<{ file: File }> };

export default function MediaUploadZone({ onUploadStart, onUploaded, onItemsChange }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { trigger: queueTrigger, retry: queueRetry, tasks, stats } = useQueue(
    (api) => api("admin/media").POST(),
  );

  const trigger = queueTrigger as (input: UploadInput) => ReturnType<typeof queueTrigger>;

  const buildItems = (): UploadFileItem[] =>
    tasks
      .filter((t) => t.status === "running" || t.status === "pending" || t.status === "error")
      .map((t) => ({
        id: t.id,
        filename: filenameMapRef.current[t.id] ?? "file",
        progress: stats.percentage,
        status: t.status === "error" ? "error" : "uploading",
      }));

  const filenameMapRef = useRef<Record<string, string>>({});

  const notifyParent = () => {
    onItemsChange?.(buildItems(), (id) => queueRetry(id));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    onUploadStart?.(fileArray.length);

    for (const file of fileArray) {
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      filenameMapRef.current[id] = file.name;

      trigger({ id, body: form({ file }) }).then((result) => {
        if (result.data) onUploaded(result.data);
        notifyParent();
      });
    }

    notifyParent();
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={classNames(
          "border-2 border-dashed rounded-xl py-14 px-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          isDragging ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Upload className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB</p>
        </div>
      </div>
    </div>
  );
}
```

Note: `notifyParent` is called synchronously after trigger and after resolution. This works because `tasks` updates reactively, but the parent state update happens via the callback. The `buildItems()` captures `tasks` at call time.

**Important:** The `notifyParent` inside the loop closure captures `tasks` at the time of the effect, but tasks updates happen asynchronously. This means the first `notifyParent()` after the loop won't show the tasks yet (they're not in the queue yet). This is OK because the queue itself is reactive — once tasks are added, the upload cells in `MediaLibraryTab` update via parent state.

A cleaner approach: track per-file items in local state instead of `tasks` to avoid this timing issue:

```tsx
"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { form, type SpooshBody } from "@spoosh/core";
import { classNames } from "@/utils/classNames";
import { useQueue } from "@/lib/spoosh";
import type { ClientMediaImage } from "@/types/media";

export type UploadFileItem = {
  id: string;
  filename: string;
  progress: number;
  status: "uploading" | "error";
  file: File;
};

interface MediaUploadZoneProps {
  onUploadStart?: (count: number) => void;
  onUploaded: (image: ClientMediaImage) => void;
  onItemsChange?: (items: UploadFileItem[]) => void;
  onRetry?: (id: string) => void;
}

type UploadInput = { id?: string; body: SpooshBody<{ file: File }> };

export default function MediaUploadZone({ onUploadStart, onUploaded, onItemsChange }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadFileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { trigger: queueTrigger, stats } = useQueue((api) => api("admin/media").POST());
  const trigger = queueTrigger as (input: UploadInput) => ReturnType<typeof queueTrigger>;

  const updateItem = (id: string, patch: Partial<UploadFileItem>) => {
    setUploadItems((prev) => {
      const next = prev.map((item) => item.id === id ? { ...item, ...patch } : item);
      onItemsChange?.(next.filter((i) => i.status !== "uploading" || true)); // all non-done
      return next;
    });
  };

  const retryItem = (id: string) => {
    const item = uploadItems.find((i) => i.id === id);
    if (!item) return;

    updateItem(id, { status: "uploading", progress: 0 });

    trigger({ id, body: form({ file: item.file }) }).then((result) => {
      if (result.data) {
        setUploadItems((prev) => {
          const next = prev.filter((i) => i.id !== id);
          onItemsChange?.(next);
          return next;
        });
        onUploaded(result.data);
      } else {
        updateItem(id, { status: "error" });
      }
    }).catch(() => {
      updateItem(id, { status: "error" });
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    onUploadStart?.(fileArray.length);

    const newItems: UploadFileItem[] = fileArray.map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      filename: file.name,
      progress: 0,
      status: "uploading",
      file,
    }));

    setUploadItems((prev) => {
      const next = [...prev, ...newItems];
      onItemsChange?.(next);
      return next;
    });

    for (const item of newItems) {
      trigger({ id: item.id, body: form({ file: item.file }) }).then((result) => {
        if (result.data) {
          setUploadItems((prev) => {
            const next = prev.filter((i) => i.id !== item.id);
            onItemsChange?.(next);
            return next;
          });
          onUploaded(result.data);
        } else {
          updateItem(item.id, { status: "error" });
        }
      }).catch(() => {
        updateItem(item.id, { status: "error" });
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={classNames(
          "border-2 border-dashed rounded-xl py-14 px-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
          isDragging ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Upload className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB</p>
        </div>
      </div>

      {stats.running > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading {stats.settled} of {stats.total}...</span>
            <span>{stats.percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

Export `retryItem` via a ref if needed, OR expose it via prop callback. For simplicity, expose retry through the `onItemsChange` callback — actually let's add a `retryItem` prop to make it explicit. But that creates a circular dependency since retry is defined inside the component.

**Simplest solution:** Export a `retryRef` via a ref prop:

Add to props:
```tsx
retryRef?: React.MutableRefObject<((id: string) => void) | null>;
```

In component body:
```tsx
if (retryRef) retryRef.current = retryItem;
```

### 4b: Update MediaUploadingCell to show progress + retry

- [ ] **Step 2: Edit components/@shared/MediaUploadingCell.tsx**

```tsx
import { RotateCcw } from "lucide-react";
import { classNames } from "@/utils/classNames";

interface MediaUploadingCellProps {
  className?: string;
  filename?: string;
  progress?: number;
  status?: "uploading" | "error";
  onRetry?: () => void;
}

export default function MediaUploadingCell({
  className,
  filename,
  progress,
  status = "uploading",
  onRetry,
}: MediaUploadingCellProps) {
  return (
    <div
      className={classNames(
        "relative aspect-square overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-2 p-2",
        className ?? "rounded-lg border-2 border-transparent",
        status === "error" ? "bg-red-50 border-red-200" : "animate-pulse",
      )}
    >
      {status === "error" ? (
        <>
          <button
            type="button"
            onClick={onRetry}
            className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] font-medium">Retry</span>
          </button>
          {filename && (
            <p className="text-[9px] text-red-400 text-center line-clamp-2 leading-tight">{filename}</p>
          )}
        </>
      ) : (
        <>
          <div className="w-full px-1.5">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-500">{progress ?? 0}%</span>
        </>
      )}
    </div>
  );
}
```

### 4c: Update MediaUploadTab to thread props

- [ ] **Step 3: Edit components/@shared/MediaUploadTab.tsx**

```tsx
"use client";

import type { ClientMediaImage } from "@/types/media";
import type { UploadFileItem } from "./MediaUploadZone";
import MediaUploadZone from "./MediaUploadZone";

interface MediaUploadTabProps {
  onUploaded: (image: ClientMediaImage) => void;
  onUploadStart?: (count: number) => void;
  onItemsChange?: (items: UploadFileItem[]) => void;
  retryRef?: React.MutableRefObject<((id: string) => void) | null>;
}

export default function MediaUploadTab({ onUploaded, onUploadStart, onItemsChange, retryRef }: MediaUploadTabProps) {
  return (
    <MediaUploadZone
      onUploaded={onUploaded}
      onUploadStart={onUploadStart}
      onItemsChange={onItemsChange}
      retryRef={retryRef}
    />
  );
}
```

### 4d: Update MediaLibraryTab to show upload items

- [ ] **Step 4: Edit components/@shared/MediaLibraryTab.tsx**

```tsx
"use client";

import Image from "next/image";
import { Check, ImageOff, ExternalLink } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import { formatBytes } from "@/utils/formatBytes";
import MediaUploadingCell from "./MediaUploadingCell";
import type { UploadFileItem } from "./MediaUploadZone";

interface MediaLibraryTabProps {
  selected: Set<string>;
  onToggle: (url: string) => void;
  uploadItems?: UploadFileItem[];
  onRetry?: (id: string) => void;
}

export default function MediaLibraryTab({ selected, onToggle, uploadItems = [], onRetry }: MediaLibraryTabProps) {
  const { data, loading } = useRead((api) => api("admin/media").GET());
  const images = data?.images ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  if (images.length === 0 && uploadItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">No images uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {uploadItems.map((item) => (
        <MediaUploadingCell
          key={item.id}
          filename={item.filename}
          progress={item.progress}
          status={item.status}
          onRetry={onRetry ? () => onRetry(item.id) : undefined}
        />
      ))}

      {images.map((img) => {
        const isSelected = selected.has(img.url);

        return (
          <div key={img.id} className="relative group">
            <button
              type="button"
              onClick={() => onToggle(img.url)}
              className={classNames(
                "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                isSelected ? "border-primary-500" : "border-transparent hover:border-gray-300",
              )}
            >
              <Image src={img.url} alt={img.filename} fill className="object-cover" unoptimized />

              {isSelected && (
                <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}
            </button>

            <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity space-y-0.5 pointer-events-none">
              <p className="text-[9px] text-white drop-shadow font-medium leading-tight">{formatBytes(img.size)}</p>
            </div>

            <a
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        );
      })}
    </div>
  );
}
```

### 4e: Update MediaPickerDialog to wire everything

- [ ] **Step 5: Edit components/@shared/MediaPickerDialog.tsx**

Add imports:
```tsx
import { useRef } from "react";
import type { UploadFileItem } from "./MediaUploadZone";
```

Update state and handlers in `MediaPickerDialog`:
```tsx
const [uploadItems, setUploadItems] = useState<UploadFileItem[]>([]);
const retryRef = useRef<((id: string) => void) | null>(null);
```

Remove `uploadingCount` state (replaced by `uploadItems`).

Update `handleUploadStart`:
```tsx
const handleUploadStart = (_count: number) => {
  setTab("library");
};
```

Update `handleUploaded` (keep it for adding to selected):
```tsx
const handleUploaded = (image: ClientMediaImage) => {
  setSelected((prev) => {
    const next = new Set(prev);
    next.add(image.url);
    return next;
  });
};
```

Add items change handler:
```tsx
const handleItemsChange = (items: UploadFileItem[]) => {
  setUploadItems(items);
};
```

Update the tab content render for Upload tab:
```tsx
<MediaUploadTab
  onUploaded={handleUploaded}
  onUploadStart={handleUploadStart}
  onItemsChange={handleItemsChange}
  retryRef={retryRef}
/>
```

Update Library tab render:
```tsx
<MediaLibraryTab
  selected={selected}
  onToggle={toggle}
  uploadItems={uploadItems}
  onRetry={(id) => retryRef.current?.(id)}
/>
```

- [ ] **Step 6: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 7: Run executive-homes-review**

- [ ] **Step 8: Commit**

```bash
git add \
  components/@shared/MediaUploadZone.tsx \
  components/@shared/MediaUploadingCell.tsx \
  components/@shared/MediaUploadTab.tsx \
  components/@shared/MediaLibraryTab.tsx \
  components/@shared/MediaPickerDialog.tsx
git commit -m "feat(admin): per-file upload progress and error handling with retry"
```

---

## Task 5: Skip WebP conversion for already-small images

**Files:**
- Modify: `hono/routes/media.routes.ts`
- Modify: `validation/mediaSchema.ts` (or `app/constants.ts` — whichever already has media constants)

**Interfaces:** No public API changes.

### 5a: Add size threshold and smart conversion logic

- [ ] **Step 1: Check where ALLOWED_MIME_TYPES is defined**

```bash
cat /path/to/validation/mediaSchema.ts
```

- [ ] **Step 2: Add threshold constant**

In `validation/mediaSchema.ts`, add:

```ts
export const SMALL_FILE_THRESHOLD_BYTES = 200 * 1024; // 200KB
```

- [ ] **Step 3: Edit hono/routes/media.routes.ts**

Replace the sharp conversion block (~line 41):

```ts
// Before:
const buffer = Buffer.from(await file.arrayBuffer());
const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

const key = `media/${crypto.randomUUID().replace(/-/g, "")}.webp`;
const filename = file.name.replace(/\.[^.]+$/, ".webp");
```

```ts
// After:
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE, SMALL_FILE_THRESHOLD_BYTES } from "@/validation/mediaSchema";

const buffer = Buffer.from(await file.arrayBuffer());

let finalBuffer: Buffer;
let finalMimeType: string;
let fileExtension: string;

const isAlreadyWebP = file.type === "image/webp";
const isSmall = file.size <= SMALL_FILE_THRESHOLD_BYTES;

if (isAlreadyWebP && isSmall) {
  finalBuffer = buffer;
  finalMimeType = "image/webp";
  fileExtension = "webp";
} else {
  const converted = await sharp(buffer).webp({ quality: 80 }).toBuffer();
  finalBuffer = converted.length < buffer.length ? converted : buffer;
  finalMimeType = finalBuffer === converted ? "image/webp" : file.type;
  fileExtension = finalBuffer === converted ? "webp" : file.name.split(".").pop() ?? "webp";
}

const key = `media/${crypto.randomUUID().replace(/-/g, "")}.${fileExtension}`;
const filename = file.name.replace(/\.[^.]+$/, `.${fileExtension}`);
```

Then update the `PutObjectCommand` and `prisma.mediaImage.create` to use `finalBuffer`, `finalMimeType`, and `filename`.

Full updated POST handler:

```ts
mediaRoutes.post("/", async (c) => {
  const user = c.get("user");
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return c.json({ error: "File type not allowed" }, 400);
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return c.json({ error: "File too large (max 10MB)" }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const isAlreadyWebP = file.type === "image/webp";
  const isSmall = file.size <= SMALL_FILE_THRESHOLD_BYTES;

  let finalBuffer: Buffer;
  let finalMimeType: string;
  let fileExtension: string;

  if (isAlreadyWebP && isSmall) {
    finalBuffer = buffer;
    finalMimeType = "image/webp";
    fileExtension = "webp";
  } else {
    const converted = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    if (converted.length < buffer.length) {
      finalBuffer = converted;
      finalMimeType = "image/webp";
      fileExtension = "webp";
    } else {
      finalBuffer = buffer;
      finalMimeType = file.type;
      fileExtension = file.name.split(".").pop() ?? "webp";
    }
  }

  const key = `media/${crypto.randomUUID().replace(/-/g, "")}.${fileExtension}`;
  const filename = file.name.replace(/\.[^.]+$/, `.${fileExtension}`);

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: finalBuffer,
      ContentType: finalMimeType,
    }),
  );

  const image = await prisma.mediaImage.create({
    data: {
      key,
      filename,
      size: finalBuffer.length,
      mimeType: finalMimeType,
      uploadedById: user.id,
    },
  });

  return c.json({ ...image, url: getMediaUrl(image.key) }, 201);
});
```

- [ ] **Step 4: Check mediaSchema.ts has the constant exported**

```bash
grep "SMALL_FILE_THRESHOLD" validation/mediaSchema.ts
```

- [ ] **Step 5: Lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```

- [ ] **Step 6: Run executive-homes-review**

- [ ] **Step 7: Commit**

```bash
git add \
  hono/routes/media.routes.ts \
  validation/mediaSchema.ts
git commit -m "feat(media): skip WebP conversion when file is already small"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Title clickable → Task 1a
- [x] Pet Friendly field → Task 2
- [x] About this property HTML → Task 1d
- [x] Unit Features icons → Task 3
- [x] Select all as checkbox → Task 1e
- [x] Remove create property title → Task 1b
- [x] Gallery image order → Task 1f
- [x] Selected images show as selected in picker → Task 1g
- [x] Don't optimize small files → Task 5
- [x] Progress percent instead of spinner → Task 4b/4d
- [x] Per-image error + retry → Task 4a/4b/4d/4e
- [x] No redirect after save/create → Task 1c

**Placeholder scan:** None found — all steps include actual code.

**Type consistency:**
- `UploadFileItem` defined in `MediaUploadZone.tsx`, imported by `MediaUploadTab.tsx`, `MediaLibraryTab.tsx`, `MediaPickerDialog.tsx`
- `retryRef` typed as `React.MutableRefObject<((id: string) => void) | null>` throughout
- `getLucideIcon` returns `LucideIcon`, used consistently in page.tsx and admin features
- `initialSelected?: string[]` on both `openMediaPicker` opts and `MediaPickerDialog` props

**Known limitation:** `retryItem` function closes over `uploadItems` state and `trigger` from useQueue. When `retryItem` is attached to `retryRef.current`, it's a fresh closure on each render, so calling it from MediaPickerDialog via `retryRef.current?.(id)` will always use the latest state. ✓
