# Media Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WordPress-style global media library for image uploads to Cloudflare R2, with a picker dialog usable from the property form.

**Architecture:** Images upload via multipart to a Hono route that streams to R2 and persists metadata in a new `MediaImage` DB table. A shared `MediaPickerDialog` opens from the property form with Library (browse) and Upload tabs. All GET/DELETE calls use spoosh `useRead`/`useWrite`; the upload POST uses native `fetch` (unavoidable — spoosh is JSON-only, multipart requires FormData).

**Tech Stack:** `@aws-sdk/client-s3` (R2 is S3-compatible), Hono FormData parsing, Prisma, geckoui Dialog/Button/Spinner/ConfirmDialog, lucide-react, `useRead`/`useWrite` from spoosh.

---

## File Map

**New files:**
- `lib/r2.ts` — R2 S3 client singleton
- `validation/mediaSchema.ts` — MIME allowlist + size constant
- `hono/routes/media.routes.ts` — GET list, POST upload, DELETE
- `types/media.ts` — `ClientMediaImage` type
- `components/@shared/MediaPickerDialog.tsx` — shared picker dialog
- `app/(dashboard)/admin/library/page.tsx` — admin library page

**Modified files:**
- `prisma/schema.prisma` — add `MediaImage` model + `User.mediaImages` relation
- `lib/schema.ts` — add `admin/media` and `admin/media/:id` ApiSchema entries
- `hono/routes/index.ts` — export `mediaRoutes`
- `hono/index.ts` — register `/admin/media` route
- `app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx` — replace URL paste with picker button
- `app/(dashboard)/admin/components/AdminSidebar.tsx` — add Library nav link

---

## Task 1: Install R2 SDK

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the package**

```bash
pnpm add @aws-sdk/client-s3
```

Expected: package added, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @aws-sdk/client-s3 for R2 uploads"
```

---

## Task 2: Configure env vars + R2 client

**Files:**
- Create: `lib/r2.ts`
- Modify: `.env` (manually — add vars, do not commit)

- [ ] **Step 1: Add env vars to `.env`**

Add these to your `.env` file (do not commit):
```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

- [ ] **Step 2: Create `lib/r2.ts`**

```typescript
import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
```

- [ ] **Step 3: Commit**

```bash
git add lib/r2.ts
git commit -m "feat: add Cloudflare R2 client"
```

---

## Task 3: Add MediaImage to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add `MediaImage` model and `User` relation**

In `prisma/schema.prisma`, add after the last model:

```prisma
model MediaImage {
  id           String   @id @default(cuid())
  key          String   @unique
  url          String
  filename     String
  size         Int
  mimeType     String
  uploadedById String
  uploadedBy   User     @relation(fields: [uploadedById], references: [id])
  createdAt    DateTime @default(now())

  @@map("media_images")
}
```

Also add `mediaImages MediaImage[]` to the `User` model (inside the `User` block, after `accounts Account[]`):

```prisma
  mediaImages  MediaImage[]
```

- [ ] **Step 2: Ask user to run migration**

**STOP — ask the user to run:**
```bash
pnpm prisma migrate dev --name add_media_images
```
Wait for confirmation that migration succeeded before proceeding.

- [ ] **Step 3: Commit schema**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add MediaImage model for media library"
```

---

## Task 4: Add types and ApiSchema

**Files:**
- Create: `types/media.ts`
- Modify: `lib/schema.ts`

- [ ] **Step 1: Create `types/media.ts`**

```typescript
import type { MediaImage } from "@/lib/generated/prisma/browser";
import type { Jsonify } from "@/types/Jsonify";

export type ClientMediaImage = Jsonify<MediaImage>;
```

- [ ] **Step 2: Add entries to `lib/schema.ts`**

Add these imports at the top of `lib/schema.ts`:
```typescript
import type { ClientMediaImage } from "@/types/media";
```

Add these entries inside the `ApiSchema` type (e.g. after the `admin/enquiries/:id` entry):
```typescript
  "admin/media": {
    GET: { data: { images: ClientMediaImage[] } };
    POST: { data: ClientMediaImage };
  };
  "admin/media/:id": {
    DELETE: { data: { ok: true }; params: { id: string } };
  };
```

- [ ] **Step 3: Commit**

```bash
git add types/media.ts lib/schema.ts
git commit -m "feat: add ClientMediaImage type and ApiSchema entries"
```

---

## Task 5: Create validation schema

**Files:**
- Create: `validation/mediaSchema.ts`

- [ ] **Step 1: Create `validation/mediaSchema.ts`**

```typescript
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];
```

- [ ] **Step 2: Commit**

```bash
git add validation/mediaSchema.ts
git commit -m "feat: add media validation constants"
```

---

## Task 6: Create Hono media routes

**Files:**
- Create: `hono/routes/media.routes.ts`

- [ ] **Step 1: Create `hono/routes/media.routes.ts`**

```typescript
import { Hono } from "hono";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";
import { authMiddleware, adminMiddleware } from "@/hono/middleware";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE } from "@/validation/mediaSchema";
import type { AppEnv } from "@/hono/types";

const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.use("*", authMiddleware, adminMiddleware);

mediaRoutes.get("/", async (c) => {
  const images = await prisma.mediaImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return c.json({ images });
});

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

  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `media/${crypto.randomUUID().replace(/-/g, "")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const image = await prisma.mediaImage.create({
    data: {
      key,
      url: `${R2_PUBLIC_URL}/${key}`,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedById: user.id,
    },
  });

  return c.json(image, 201);
});

mediaRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const image = await prisma.mediaImage.findUnique({ where: { id } });
  if (!image) return c.json({ error: "Not found" }, 404);

  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: image.key }));
  await prisma.mediaImage.delete({ where: { id } });

  return c.json({ ok: true });
});

export default mediaRoutes;
```

- [ ] **Step 2: Verify the route compiles**

Run:
```bash
pnpm typecheck
```

Expected: no errors in `hono/routes/media.routes.ts`.

- [ ] **Step 3: Commit**

```bash
git add hono/routes/media.routes.ts
git commit -m "feat: add media upload/list/delete Hono routes"
```

---

## Task 7: Register media routes in Hono

**Files:**
- Modify: `hono/routes/index.ts`
- Modify: `hono/index.ts`

- [ ] **Step 1: Export from `hono/routes/index.ts`**

Add this line to `hono/routes/index.ts`:
```typescript
export { default as mediaRoutes } from "./media.routes";
```

- [ ] **Step 2: Register in `hono/index.ts`**

Add `mediaRoutes` to the imports:
```typescript
import {
  propertyRoutes,
  propertyTypesRoutes,
  provincesRoutes,
  featuresRoutes,
  transitStationsRoutes,
  locationsRoutes,
  adminEnquiriesRoutes,
  publicPropertiesRoutes,
  publicEnquiriesRoutes,
  mediaRoutes,
} from "@/hono/routes";
```

Add the route registration after the existing admin routes:
```typescript
router.route("/admin/media", mediaRoutes);
```

- [ ] **Step 3: Commit**

```bash
git add hono/routes/index.ts hono/index.ts
git commit -m "feat: register media routes at /api/admin/media"
```

---

## Task 8: Create MediaPickerDialog

**Files:**
- Create: `components/@shared/MediaPickerDialog.tsx`

- [ ] **Step 1: Create `components/@shared/MediaPickerDialog.tsx`**

```typescript
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, Images, Check, X, ImageOff } from "lucide-react";
import { Button, Dialog, Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { ClientMediaImage } from "@/types/media";

interface MediaPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}

type Tab = "library" | "upload";

function LibraryTab({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (url: string) => void;
}) {
  const { data, loading } = useRead((api) => api("admin/media").GET());
  const images = data?.images ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">No images uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {images.map((img) => {
        const isSelected = selected.has(img.url);
        return (
          <button
            key={img.id}
            type="button"
            onClick={() => onToggle(img.url)}
            className={classNames(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
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
        );
      })}
    </div>
  );
}

function UploadTab({
  onUploaded,
}: {
  onUploaded: (image: ClientMediaImage) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload failed");
        }

        const image: ClientMediaImage = await res.json();
        onUploaded(image);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    upload(files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      className={classNames(
        "flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl py-16 px-8 transition-colors cursor-pointer",
        dragOver ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300",
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploading ? (
        <>
          <Spinner className="w-8 h-8 text-primary-600" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </>
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drop an image here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · Max 10MB</p>
          </div>
        </>
      )}
    </div>
  );
}

export function openMediaPicker(opts: {
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}) {
  Dialog.show({
    className: "w-full max-w-3xl",
    content: ({ dismiss }) => (
      <MediaPickerDialog
        open
        onClose={dismiss}
        onSelect={(urls) => { opts.onSelect(urls); dismiss(); }}
        multiple={opts.multiple}
      />
    ),
  });
}

export default function MediaPickerDialog({
  onClose,
  onSelect,
  multiple = true,
}: MediaPickerDialogProps) {
  const [tab, setTab] = useState<Tab>("library");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (!multiple) {
        next.clear();
        if (!prev.has(url)) next.add(url);
        return next;
      }
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const handleUploaded = (image: ClientMediaImage) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(image.url);
      return next;
    });
    setTab("library");
  };

  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Media Library</h2>
        <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 pb-0">
        {(["library", "upload"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={classNames(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t
                ? "border-primary-500 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {t === "library" ? <Images className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {t === "library" ? "Library" : "Upload"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === "library" ? (
          <LibraryTab selected={selected} onToggle={toggle} />
        ) : (
          <UploadTab onUploaded={handleUploaded} />
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-white">
        <span className="text-sm text-gray-500">
          {selected.size > 0
            ? `${selected.size} image${selected.size > 1 ? "s" : ""} selected`
            : "None selected"}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selected.size === 0}
            onClick={() => onSelect(Array.from(selected))}
          >
            Add Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/@shared/MediaPickerDialog.tsx
git commit -m "feat: add MediaPickerDialog shared component"
```

---

## Task 9: Update PropertyFormMediaSection

**Files:**
- Modify: `app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx`

- [ ] **Step 1: Replace file content**

```typescript
"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Images, Trash2 } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { openMediaPicker } from "@/components/@shared/MediaPickerDialog";
import type { PropertyCreateInput } from "@/validation/propertySchema";

export default function PropertyFormMediaSection() {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const imageUrls = watch("imageUrls") ?? [];

  const handleAddImages = () => {
    openMediaPicker({
      multiple: true,
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
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

- [ ] **Step 2: Commit**

```bash
git add "app/(dashboard)/admin/properties/components/PropertyFormMediaSection.tsx"
git commit -m "feat: replace URL paste with media library picker in property form"
```

---

## Task 10: Create admin library page

**Files:**
- Create: `app/(dashboard)/admin/library/page.tsx`

- [ ] **Step 1: Create `app/(dashboard)/admin/library/page.tsx`**

```typescript
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { Button, ConfirmDialog, Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { ClientMediaImage } from "@/types/media";

function UploadButton({ onUploaded }: { onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      await fetch("/api/admin/media", { method: "POST", body: formData });
      onUploaded();
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={classNames(
      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer",
      uploading ? "opacity-50 pointer-events-none" : "",
    )}>
      {uploading ? <Spinner className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
      {uploading ? "Uploading..." : "Upload Image"}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
    </label>
  );
}

export default function LibraryPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/media").GET());
  const { trigger: deleteImage } = useWrite((api) => api("admin/media/:id").DELETE());

  const images = data?.images ?? [];

  const handleDelete = (image: ClientMediaImage) => {
    ConfirmDialog.show({
      title: "Delete image",
      description: `Delete "${image.filename}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        await deleteImage({ params: { id: image.id } });
        refetch();
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">{images.length} image{images.length !== 1 ? "s" : ""}</p>
        </div>
        <UploadButton onUploaded={refetch} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-primary-600" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <ImageOff className="w-12 h-12" />
          <p className="text-sm">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
            >
              <Image src={img.url} alt={img.filename} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end">
                <div className="w-full px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <span className="text-white text-[10px] truncate flex-1 mr-2">{img.filename}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(dashboard)/admin/library/page.tsx"
git commit -m "feat: add admin media library page"
```

---

## Task 11: Add Library link to AdminSidebar

**Files:**
- Modify: `app/(dashboard)/admin/components/AdminSidebar.tsx`

- [ ] **Step 1: Add `Images` to lucide-react import**

In `AdminSidebar.tsx`, find the lucide-react import and add `Images`:
```typescript
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  X,
  MapPin,
  Train,
  ChevronDown,
  Tag,
  Layers,
  Images,
} from "lucide-react";
```

- [ ] **Step 2: Add Library nav link**

After the Transit Stations `<Link>` block (before the closing `</nav>` tag), add:
```typescript
          <Link
            href="/admin/library"
            onClick={onClose}
            className={classNames(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin/library") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <Images className="w-4 h-4 shrink-0" />
            Library
          </Link>
```

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/admin/components/AdminSidebar.tsx"
git commit -m "feat: add Library link to admin sidebar"
```

---

## Task 12: Lint and typecheck

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: no errors. Fix any issues before proceeding.

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors. Fix any type issues before proceeding.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve lint and type errors in media library"
```

---

## Verification Checklist

1. Set R2 env vars in `.env` — confirmed
2. Migration ran successfully — confirmed
3. `/admin/library` loads, shows empty state with Upload button
4. Upload a JPEG → appears in grid → verify object exists in R2 bucket
5. Open property edit form → "Add Images" → Library tab shows uploaded image → select → "Add Selected" → image appears in property form grid
6. Upload tab in picker: drop file → auto-selected → "Add Selected" → image in form
7. Delete from library page → confirm dialog → grid refreshes → object removed from R2
8. `pnpm lint && pnpm typecheck` — zero errors
