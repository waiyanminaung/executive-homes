# Media Library Feature Design

**Date:** 2026-06-17  
**Status:** Approved

## Context

Admin currently pastes external image URLs into property forms. No upload infrastructure exists. This adds a WordPress-style global media library: upload images to Cloudflare R2, browse/select from any property form.

## Scope

- Images only (no PDF/file support in v1)
- Admin-only feature (auth + admin middleware)
- Global library — upload once, reuse across properties

## Storage

**Cloudflare R2** via `@aws-sdk/client-s3` (S3-compatible).

Required env vars:
```
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL   # public CDN URL prefix (e.g. https://pub-xxx.r2.dev)
```

R2 client lives in `lib/r2.ts`.

## Database

New Prisma model in `prisma/schema.prisma`:

```prisma
model MediaImage {
  id          String   @id @default(cuid())
  key         String   @unique
  url         String
  filename    String
  size        Int
  mimeType    String
  uploadedById String
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  createdAt   DateTime @default(now())

  @@map("media_images")
}
```

`PropertyImage.url` stays as URL string — no FK to `MediaImage`. Library and property images stay decoupled.

## API Routes

New file: `hono/routes/media.routes.ts`  
Registered in main Hono app under `/api/admin/media`.  
All routes require `authMiddleware` + `adminMiddleware`.

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/api/admin/media` | — | Paginated `MediaImage[]` |
| `POST` | `/api/admin/media` | `multipart/form-data` (field: `file`) | Created `MediaImage` |
| `DELETE` | `/api/admin/media/:id` | — | `{ success: true }` |

Upload flow:
1. Validate MIME type (allow: `image/jpeg`, `image/png`, `image/webp`, `image/gif`)
2. Validate size (max 10MB)
3. Generate unique key: `media/${cuid()}.${ext}`
4. `PutObject` to R2
5. `prisma.mediaImage.create()`
6. Return created record

Delete flow:
1. Find `MediaImage` by id
2. `DeleteObject` from R2 using `key`
3. `prisma.mediaImage.delete()`

## ApiSchema

Add to `lib/schema.ts`:
```ts
"admin/media": {
  GET: { response: { images: ClientMediaImage[]; total: number; page: number } }
  POST: { response: ClientMediaImage }
  "DELETE /[id]": { response: { success: boolean } }
}
```

New type in `types/media.ts`:
```ts
export type ClientMediaImage = Jsonify<MediaImage>
```

## UI Components

### `/admin/library` page

Path: `app/(dashboard)/admin/libraries/page.tsx`

- Masonry/grid of all uploaded images
- Upload button (top-right) → opens upload dropzone dialog
- Hover on image: delete button (confirm dialog before delete)
- Pagination at bottom

### `MediaPickerDialog` (`components/@shared/MediaPickerDialog.tsx`)

Props:
```ts
interface MediaPickerDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (urls: string[]) => void
  multiple?: boolean
}
```

Two tabs:
- **Library** — paginated image grid, click to toggle select, "Add Selected" button
- **Upload** — drag-drop zone or file picker, uploads on drop/select, auto-selects uploaded images, then confirms

### `PropertyFormMediaSection` update

Replace URL paste input with "Add Images" button.  
Button opens `MediaPickerDialog` (multiple=true).  
Selected URLs appended to `imageUrls` field array.  
Existing image grid display + delete-on-hover stays unchanged.

## Admin Sidebar

Add "Library" link under existing nav. Path: `/admin/library`. Icon: `Images` from lucide-react.

## Validation

New file: `validation/mediaSchema.ts`
```ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
```

Validated in Hono controller layer, not service.

## Testing / Verification

1. Set R2 env vars in `.env`
2. Run `pnpm db:seed` after migration (no seed needed for media)
3. Visit `/admin/library` — should show empty grid + upload button
4. Upload a JPEG — should appear in grid, check R2 bucket for object
5. Open property form → "Add Images" → Library tab shows uploaded image → select → confirm → image appears in property form media grid
6. Upload tab: drop image → auto-selected → confirm → image in form
7. Delete from library → confirm dialog → image removed from grid + deleted from R2
8. Run `pnpm lint && pnpm typecheck` — zero errors
